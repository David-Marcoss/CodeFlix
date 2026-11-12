import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/sequelize/fake-unit-of-work-sequelise';
import { StorageInMemory } from '../../../../../shared/infra/storage/storage.in-memory';
import { Video } from '../../../../domain/video.aggregate';
import { IVideoRepository } from '../../../../domain/video.repository';
import { UploadAudioVideoMediaUseCase } from '../upload-audio-video-media.use-case';

describe('UploadAudioVideoMediaUseCase', () => {
  it.each(['video', 'trailer'] as const)(
    'stores the Cloudinary URL for %s without encoder events',
    async (field) => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.clearEvents();
      const storage = new StorageInMemory();
      jest
        .spyOn(storage, 'store')
        .mockResolvedValue({
          url: 'https://res.cloudinary.com/demo/video/upload/file.mp4',
        });
      const repo = {
        getById: jest.fn().mockResolvedValue(video),
        update: jest.fn(),
      } as unknown as IVideoRepository;
      const useCase = new UploadAudioVideoMediaUseCase(
        new UnitOfWorkFakeInMemory(),
        repo,
        storage,
      );
      await useCase.execute({
        video_id: video.video_id.id,
        field,
        file: {
          raw_name: 'file.mp4',
          data: Buffer.from('video'),
          mime_type: 'video/mp4',
          size: 5,
        },
      });
      expect(video[field]?.url).toBe(
        'https://res.cloudinary.com/demo/video/upload/file.mp4',
      );
      expect(video[field]?.status).toBe('completed');
      expect(repo.update).toHaveBeenCalledWith(video);
      expect(video.events.size).toBe(0);
    },
  );

  it('does not persist when Cloudinary fails', async () => {
    const video = Video.fake().aVideoWithoutMedias().build();
    video.clearEvents();
    const storage = new StorageInMemory();
    jest.spyOn(storage, 'store').mockRejectedValue(new Error('upload failed'));
    const repo = {
      getById: jest.fn().mockResolvedValue(video),
      update: jest.fn(),
    } as unknown as IVideoRepository;
    const useCase = new UploadAudioVideoMediaUseCase(
      new UnitOfWorkFakeInMemory(),
      repo,
      storage,
    );
    await expect(
      useCase.execute({
        video_id: video.video_id.id,
        field: 'video',
        file: {
          raw_name: 'file.mp4',
          data: Buffer.from('video'),
          mime_type: 'video/mp4',
          size: 5,
        },
      }),
    ).rejects.toThrow('upload failed');
    expect(repo.update).not.toHaveBeenCalled();
  });
});
