import { setupSequelizeForVideo } from '../../../../infra/sequelize/testing/helper';
import { VideoSequelizeRepository } from '../../../../infra/sequelize/video-sequelize.repository';
import { VideoModel } from '../../../../infra/sequelize/video-model';
import { Video } from '../../../../domain/video.aggregate';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { StorageInMemory } from '../../../../../shared/infra/storage/storage.in-memory';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { CastMemberSequelizeRepository } from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../../cast-member/infra/db/sequelize/cast-member.model';
import { FindVideoUseCase } from '../../find-video/find-video.use-case';
import { UploadImageMediaUseCase } from '../../upload-image-media/upload-image-media.use-case';
import { UploadAudioVideoMediaUseCase } from '../../upload-audio-video-media/upload-audio-video-media.use-case';
import { ListVideosUseCase } from '../list-videos.use-case';

describe('Direct media upload and video listing', () => {
  const setup = setupSequelizeForVideo();
  const make = () => {
    const uow = new UnitOfWorkSequelize(setup.sequelize);
    const repo = new VideoSequelizeRepository(VideoModel, uow);
    const find = new FindVideoUseCase(
      repo,
      new CategorySequelizeRepository(CategoryModel),
      new GenreSequelizeRepository(GenreModel),
      new CastMemberSequelizeRepository(CastMemberModel),
    );
    return { uow, repo, list: new ListVideosUseCase(repo, find), find };
  };

  it('returns an empty array when there are no videos', async () => {
    expect(await make().list.execute()).toEqual({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 0,
    });
  });

  it('persists and returns Cloudinary URLs for all five media fields', async () => {
    const { repo, uow, list, find } = make();
    const video = Video.fake().aVideoWithoutMedias().build();
    video.categories_id.clear();
    video.genres_id.clear();
    video.cast_members_id.clear();
    await repo.create(video);
    const storage = new StorageInMemory();
    const imageUpload = new UploadImageMediaUseCase(uow, repo, storage);
    const videoUpload = new UploadAudioVideoMediaUseCase(uow, repo, storage);
    for (const field of [
      'banner',
      'thumbnail',
      'thumbnail_half',
      'video',
      'trailer',
    ] as const) {
      const url = `https://res.cloudinary.com/demo/upload/${field}`;
      jest.spyOn(storage, 'store').mockResolvedValue({ url });
      const file = {
        data: Buffer.from('file'),
        size: 4,
        raw_name: `${field}.${field === 'video' || field === 'trailer' ? 'mp4' : 'png'}`,
        mime_type:
          field === 'video' || field === 'trailer' ? 'video/mp4' : 'image/png',
      };
      if (field === 'video' || field === 'trailer')
        await videoUpload.execute({ video_id: video.video_id.id, field, file });
      else
        await imageUpload.execute({ video_id: video.video_id.id, field, file });
    }
    const second = Video.fake().aVideoWithoutMedias().build();
    second.categories_id.clear();
    second.genres_id.clear();
    second.cast_members_id.clear();
    await repo.create(second);
    const result = await list.execute();
    const output = result.items;
    expect(output).toHaveLength(2);
    const page = await list.execute({ page: 2, per_page: 1 });
    expect(page.items).toHaveLength(1);
    expect(page).toMatchObject({
      total: 2,
      current_page: 2,
      per_page: 1,
      last_page: 2,
    });
    const filtered = await list.execute({ filter: { title: video.title } });
    expect(filtered.items.map((item) => item.id)).toContain(video.video_id.id);
    const uploaded = output.find((item) => item.id === video.video_id.id)!;
    for (const field of [
      'banner',
      'thumbnail',
      'thumbnail_half',
      'video',
      'trailer',
    ] as const) {
      expect(uploaded[field]).toBe(
        `https://res.cloudinary.com/demo/upload/${field}`,
      );
    }
    expect(uploaded.is_published).toBe(true);
    expect(await find.execute({ video_id: video.video_id.id })).toEqual(
      uploaded,
    );
  });
});
