import { DeleteVideoUseCase } from '../delete-video.use-case';
import { Video } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repsitory';
import { StorageInMemory } from '../../../../../shared/infra/storage/storage.in-memory';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/sequelize/fake-unit-of-work-sequelise';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';

describe('DeleteVideoUseCase', () => {
  it.each([true, false])(
    'deletes video and its files (with media: %s)',
    async (withMedia) => {
      const video = withMedia
        ? Video.fake().aVideoWithAllMedias().build()
        : Video.fake().aVideoWithoutMedias().build();
      const repo = new VideoInMemoryRepository();
      const storage = new StorageInMemory();
      const remove = jest.spyOn(storage, 'deleteFile');
      await repo.create(video);
      const useCase = new DeleteVideoUseCase(
        new UnitOfWorkFakeInMemory(),
        repo,
        storage,
      );
      await useCase.execute({ video_id: video.video_id.id });
      await expect(repo.getById(video.video_id)).rejects.toBeInstanceOf(
        NotFoundError,
      );
      expect(remove).toHaveBeenCalledTimes(withMedia ? 5 : 0);
      if (withMedia) {
        expect(remove).toHaveBeenCalledWith(
          `${video.banner!.location}/${video.banner!.name}`,
          'image/jpeg',
        );
        expect(remove).toHaveBeenCalledWith(
          `${video.video!.raw_location}/${video.video!.name}`,
          'video/mp4',
        );
      }
    },
  );

  it('keeps references on remote failure and allows retry after partial deletion', async () => {
    const video = Video.fake().aVideoWithAllMedias().build();
    const repo = new VideoInMemoryRepository();
    const storage = new StorageInMemory();
    const remove = jest
      .spyOn(storage, 'deleteFile')
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('Cloudinary unavailable'));
    await repo.create(video);
    const useCase = new DeleteVideoUseCase(
      new UnitOfWorkFakeInMemory(),
      repo,
      storage,
    );
    await expect(
      useCase.execute({ video_id: video.video_id.id }),
    ).rejects.toThrow('Cloudinary unavailable');
    expect(await repo.getById(video.video_id)).not.toBeNull();
    remove.mockRestore();
    await useCase.execute({ video_id: video.video_id.id });
    await expect(repo.getById(video.video_id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('reports missing videos without deleting files', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    const storage = new StorageInMemory();
    const remove = jest.spyOn(storage, 'deleteFile');
    const useCase = new DeleteVideoUseCase(
      new UnitOfWorkFakeInMemory(),
      new VideoInMemoryRepository(),
      storage,
    );
    await expect(
      useCase.execute({ video_id: video.video_id.id }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(remove).not.toHaveBeenCalled();
  });
});
