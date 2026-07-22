import { ICastMemberRepository } from '../../../../../cast-member/domain/cast-member.repository';

import { v2 as cloudinary } from 'cloudinary';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ICategoryRepository } from '../../../../../category/domain/category.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { IGenreRepository } from '../../../../../genre/domain/genre.repository';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
//import { InMemoryStorage } from '../../../../../shared/infra/storage/in-memory.storage';
import { IVideoRepository } from '../../../../domain/video.repository';

import { Video } from '../../../../domain/video.aggregate';
import { Category } from '../../../../../category/domain/category.aggregate';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import { InvalidMediaFileMimeTypeError } from '../../../../../shared/domain/validators/media-file-validator';
import { Config } from '../../../../../shared/infra/config';
import { UploadImageMediaUseCase } from '../upload-image-media.use-case';
import { setupSequelizeForVideo } from '../../../../infra/sequelize/testing/helper';
import { CastMemberSequelizeRepository } from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../../cast-member/infra/db/sequelize/cast-member.model';
import { VideoModel } from '../../../../infra/sequelize/video-model';
import { VideoSequelizeRepository } from '../../../../infra/sequelize/video-sequelize.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { CloudnaryStorage } from '../../../../../shared/infra/storage/claudnary.storage.';

describe('UploadImageMediasUseCase Integration Tests', () => {
  let uploadImageMediasUseCase: UploadImageMediaUseCase;
  let videoRepo: IVideoRepository;
  let categoryRepo: ICategoryRepository;
  let genreRepo: IGenreRepository;
  let castMemberRepo: ICastMemberRepository;
  let uow: UnitOfWorkSequelize;
  let storageService: CloudnaryStorage;
  let uploadedImageId: string | undefined;
  const sequelizeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    uploadedImageId = undefined;
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);

    const config = Config.cloudnaryCredentials();
    cloudinary.config({
      api_key: config.cloudnary_api_key,
      api_secret: config.cloudnary_api_secret,
      cloud_name: config.cloudnary_cloud_name,
    });

    storageService = new CloudnaryStorage(cloudinary);

    uploadImageMediasUseCase = new UploadImageMediaUseCase(
      uow,
      videoRepo,
      storageService,
    );
  });

  afterEach(async () => {
    if (uploadedImageId) {
      await storageService.deleteFile(uploadedImageId, 'image/jpeg');
    }
  });

  it('should throw error when video not found', async () => {
    await expect(
      uploadImageMediasUseCase.execute({
        video_id: '4e9e2e4e-4b4a-4b4a-8b8b-8b8b8b8b8b8b',
        field: 'banner',
        file: {
          raw_name: 'banner.jpg',
          data: Buffer.from(''),
          mime_type: 'image/jpg',
          size: 100,
        },
      }),
    ).rejects.toThrow(
      new NotFoundError('4e9e2e4e-4b4a-4b4a-8b8b-8b8b8b8b8b8b', Video),
    );
  });

  it('should throw error when image is invalid', async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.create(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.create(genre);
    const castMember = CastMember.fake().aCastMember().build();
    await castMemberRepo.create(castMember);
    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();

    await videoRepo.create(video);

    await expect(
      uploadImageMediasUseCase.execute({
        video_id: video.video_id.id,
        field: 'banner',
        file: {
          raw_name: 'banner.jpg',
          data: Buffer.from(''),
          mime_type: 'image/jpg',
          size: 100,
        },
      }),
    ).rejects.toThrow(
      new InvalidMediaFileMimeTypeError('image/jpg', [
        'image/jpeg',
        'image/png',
        'image/gif',
      ]),
    );
  }, 10000);

  it('should upload banner image', async () => {
    const storeSpy = jest.spyOn(storageService, 'store');
    const imageData = readFileSync(join(__dirname, 'image-test.jpeg'));
    const category = Category.fake().aCategory().build();
    await categoryRepo.create(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.create(genre);
    const castMember = CastMember.fake().aCastMember().build();
    await castMemberRepo.create(castMember);
    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();

    await videoRepo.create(video);

    await uploadImageMediasUseCase.execute({
      video_id: video.video_id.id,
      field: 'banner',
      file: {
        raw_name: 'image-test.jpeg',
        data: imageData,
        mime_type: 'image/jpeg',
        size: imageData.length,
      },
    });
    uploadedImageId = video.banner?.url;

    const videoUpdated = await videoRepo.getById(video.video_id);
    expect(videoUpdated!.banner).toBeDefined();
    expect(videoUpdated!.banner!.name.includes('.jpeg')).toBeTruthy();
    expect(videoUpdated!.banner!.location).toBe(
      `videos/${videoUpdated!.video_id.id}/images`,
    );
    expect(storeSpy).toHaveBeenCalledWith({
      data: imageData,
      id: videoUpdated!.banner!.url,
      mime_type: 'image/jpeg',
    });
  }, 10000);
});
