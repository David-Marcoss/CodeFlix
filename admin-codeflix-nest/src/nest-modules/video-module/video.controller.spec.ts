import { Test } from '@nestjs/testing';
import request from 'supertest';
import { VideoController } from './video.controller';
import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';
import { CreateVideoUseCase } from '../../core/video/application/use-cases/create-video/create-video.use-case';
import { FindVideoUseCase } from '../../core/video/application/use-cases/find-video/find-video.use-case';
import { ListVideosUseCase } from '../../core/video/application/use-cases/list-videos/list-videos.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/use-cases/update-genre/update-genre.use-case';
import { UploadAudioVideoMediaUseCase } from '../../core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.use-case';
import { UploadImageMediaUseCase } from '../../core/video/application/use-cases/upload-image-media/upload-image-media.use-case';
import { applyGlobalConfig } from '../global-config';

describe('VideoController GET /videos', () => {
  it.each([
    [],
    [{ id: 'video-id', video: 'https://res.cloudinary.com/demo/video.mp4' }],
  ])('wraps the list with data', async (...items) => {
    const meta = {
      total: items.length,
      current_page: 1,
      per_page: 15,
      last_page: items.length ? 1 : 0,
    };
    const execute = jest.fn().mockResolvedValue({ items, ...meta });
    const module = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        CreateVideoUseCase,
        FindVideoUseCase,
        ListVideosUseCase,
        UpdateVideoUseCase,
        UploadAudioVideoMediaUseCase,
        UploadImageMediaUseCase,
      ].map((provide) => ({ provide, useValue: { execute } })),
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CheckIsAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();
    const app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    try {
      await request(app.getHttpServer())
        .get('/videos')
        .expect(200)
        .expect({ data: items, meta });
      expect(execute).toHaveBeenCalledWith({ filter: {} });
      const category = '123e4567-e89b-42d3-a456-426614174000';
      await request(app.getHttpServer())
        .get(
          `/videos?page=2&per_page=5&sort=title&sort_dir=desc&filter[title]=test&filter[categories_id][]=${category}&filter[genres_id][]=${category}&filter[cast_members_id][]=${category}`,
        )
        .expect(200);
      const input = execute.mock.calls[1][0];
      expect(input).toMatchObject({
        page: '2',
        per_page: '5',
        sort: 'title',
        sort_dir: 'desc',
        filter: { title: 'test' },
      });
      for (const field of ['categories_id', 'genres_id', 'cast_members_id'])
        expect(input.filter[field][0].id).toBe(category);
    } finally {
      await app.close();
    }
  });
});
