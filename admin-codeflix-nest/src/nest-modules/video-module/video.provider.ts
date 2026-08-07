import { getModelToken } from '@nestjs/sequelize';
import { CreateVideoUseCase } from '../../core/video/application/use-cases/create-video/create-video.use-case';

import { IVideoRepository } from '../../core/video/domain/video.repository';
import { ICategoryRepository } from '../../core/category/domain/category.repository';

import { VideoInMemoryRepository } from '../../core/video/infra/db/in-memory/video-in-memory.repsitory';
import { UnitOfWorkSequelize } from '../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { IUnitOfWork } from '../../core/shared/domain/repository/unit-of-work-interface';
import { CATEGORY_PROVIDERS } from '../categories-module/categories.provider';
import { FindVideoUseCase } from '../../core/video/application/use-cases/find-video/find-video.use-case';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../core/category/application/use-cases/validations/validate-categories-ids-exists-in-database';
import { VideoSequelizeRepository } from '../../core/video/infra/sequelize/video-sequelize.repository';
import { VideoModel } from '../../core/video/infra/sequelize/video-model';
import { UpdateVideoUseCase } from '../../core/video/application/use-cases/update-genre/update-genre.use-case';
import { ValidateGenresIdsExistsInDatabaseUseCase } from '../../core/genre/application/use-cases/validations/validate-genres-ids-exists-in-database';
import { ValidateCastMembersIdsExistsInDatabaseUseCase } from '../../core/cast-member/application/use-cases/validations/validate-cast_members-ids-exists-in-database';
import { IGenreRepository } from '../../core/genre/domain/genre.repository';
import { GENRES_PROVIDERS } from '../genre-module/genre.provider';
import { ICastMemberRepository } from '../../core/cast-member/domain/cast-member.repository';
import { CAST_MEMBER_PROVIDERS } from '../cast-members-module/cast-members.provider';
import { UploadAudioVideoMediaUseCase } from '../../core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.use-case';
import { IStorage } from '../../core/shared/application/storage.interface';
import { UploadImageMediaUseCase } from '../../core/video/application/use-cases/upload-image-media/upload-image-media.use-case';
import { PublishVideoMediaReplacedInQueueHandler } from '../../core/video/application/handlers/publish-video-media-replaced-in-queue.handler';
import { ApplicationService } from '../../core/shared/application/aplication-service';
import { IMenssageBroker } from '../../core/shared/application/menssage-broker.interface';
import { Scope } from '@nestjs/common';
import { ProcessAudioVideoMediaUseCase } from '../../core/video/application/use-cases/process-audio-video-media/process-audio-video-media.use-case';

export const REPOSITORIES = {
  VIDEO_REPOSITORY: {
    provide: 'VideoRepository',
    useExisting: VideoSequelizeRepository,
    scope: Scope.REQUEST,
  },
  VIDEO_IN_MEMORY_REPOSITORY: {
    provide: VideoInMemoryRepository,
    useClass: VideoInMemoryRepository,
  },
  VIDEO_SEQUELIZE_REPOSITORY: {
    provide: VideoSequelizeRepository,
    useFactory: (videoModel: typeof VideoModel, uow: UnitOfWorkSequelize) => {
      return new VideoSequelizeRepository(videoModel, uow);
    },
    scope: Scope.REQUEST,
    inject: [getModelToken(VideoModel), 'UnitOfWork'],
  },
};

export const VALIDATIONS = {
  VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE: {
    provide: ValidateCategoriesIdsExistsInDatabaseUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new ValidateCategoriesIdsExistsInDatabaseUseCase(categoryRepo);
    },
    inject: [CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  VALIDATE_GENRES_IDS_EXISTS_IN_DATABASE_USE_CASE: {
    provide: ValidateGenresIdsExistsInDatabaseUseCase,
    useFactory: (genreRepo: IGenreRepository) => {
      return new ValidateGenresIdsExistsInDatabaseUseCase(genreRepo);
    },
    inject: [GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide],
  },
  VALIDATE_CAST_MEMBERS_IDS_EXISTS_IN_DATABASE_USE_CASE: {
    provide: ValidateCastMembersIdsExistsInDatabaseUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new ValidateCastMembersIdsExistsInDatabaseUseCase(castMemberRepo);
    },
    inject: [CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
};

export const USE_CASES = {
  CREATE_VIDEO_USE_CASE: {
    provide: CreateVideoUseCase,
    useFactory: (
      uow: IUnitOfWork,
      videoRepo: IVideoRepository,
      categoryRepo: ICategoryRepository,
      genreRepo: IGenreRepository,
      castMemberRepo: ICastMemberRepository,
      validateCategoriesIds: ValidateCategoriesIdsExistsInDatabaseUseCase,
      validateCastMembersIds: ValidateCastMembersIdsExistsInDatabaseUseCase,
      validateGenresIds: ValidateGenresIdsExistsInDatabaseUseCase,
    ) => {
      return new CreateVideoUseCase(
        uow,
        videoRepo,
        categoryRepo,
        validateCategoriesIds,
        genreRepo,
        validateGenresIds,
        castMemberRepo,
        validateCastMembersIds,
      );
    },
    scope: Scope.REQUEST,
    inject: [
      'UnitOfWork',
      REPOSITORIES.VIDEO_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      VALIDATIONS.VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
      VALIDATIONS.VALIDATE_CAST_MEMBERS_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
      VALIDATIONS.VALIDATE_GENRES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
    ],
  },
  UPDATE_VIDEO_USE_CASE: {
    provide: UpdateVideoUseCase,
    useFactory: (
      uow: IUnitOfWork,
      videoRepo: IVideoRepository,
      categoryRepo: ICategoryRepository,
      genreRepo: IGenreRepository,
      castMemberRepo: ICastMemberRepository,
      validateCategoriesIds: ValidateCategoriesIdsExistsInDatabaseUseCase,
      validateCastMembersIds: ValidateCastMembersIdsExistsInDatabaseUseCase,
      validateGenresIds: ValidateGenresIdsExistsInDatabaseUseCase,
    ) => {
      return new UpdateVideoUseCase(
        uow,
        videoRepo,
        categoryRepo,
        validateCategoriesIds,
        genreRepo,
        validateGenresIds,
        castMemberRepo,
        validateCastMembersIds,
      );
    },
    scope: Scope.REQUEST,
    inject: [
      'UnitOfWork',
      REPOSITORIES.VIDEO_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      VALIDATIONS.VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
      VALIDATIONS.VALIDATE_CAST_MEMBERS_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
      VALIDATIONS.VALIDATE_GENRES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
    ],
  },

  GET_VIDEO_USE_CASE: {
    provide: FindVideoUseCase,
    useFactory: (
      videoRepo: IVideoRepository,
      categoryRepo: ICategoryRepository,
      genreRepo: IGenreRepository,
      castMemberRepo: ICastMemberRepository,
    ) => {
      return new FindVideoUseCase(
        videoRepo,
        categoryRepo,
        genreRepo,
        castMemberRepo,
      );
    },
    scope: Scope.REQUEST,
    inject: [
      REPOSITORIES.VIDEO_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    ],
  },
  UPLOAD_AUDIO_VIDEO_MEDIA_USE_CASE: {
    provide: UploadAudioVideoMediaUseCase,
    useFactory: (
      appService: ApplicationService,
      videoRepo: IVideoRepository,
      storage: IStorage,
    ) => {
      return new UploadAudioVideoMediaUseCase(appService, videoRepo, storage);
    },
    scope: Scope.REQUEST,
    inject: [
      ApplicationService,
      REPOSITORIES.VIDEO_REPOSITORY.provide,
      'IStorage',
    ],
  },
  UPLOAD_IMAGE_MEDIA_USE_CASE: {
    provide: UploadImageMediaUseCase,
    useFactory: (
      uow: IUnitOfWork,
      videoRepo: IVideoRepository,
      storage: IStorage,
    ) => {
      return new UploadImageMediaUseCase(uow, videoRepo, storage);
    },
    scope: Scope.REQUEST,
    inject: ['UnitOfWork', REPOSITORIES.VIDEO_REPOSITORY.provide, 'IStorage'],
  },
  PROCESS_AUDIO_VIDEO_MEDIA_USE_CASE: {
    provide: ProcessAudioVideoMediaUseCase,
    useFactory: (uow: IUnitOfWork, videoRepo: IVideoRepository) => {
      return new ProcessAudioVideoMediaUseCase(uow, videoRepo);
    },
    inject: ['UnitOfWork', REPOSITORIES.VIDEO_REPOSITORY.provide],
    scope: Scope.REQUEST,
  },
};

// Registra o ouvinte que irar processar o evento de video
export const HANDLERS = {
  PUBLISH_VIDEO_MEDIA_REPLACED_IN_QUEUE_HANDLER: {
    provide: PublishVideoMediaReplacedInQueueHandler,
    useFactory: (messageBroker: IMenssageBroker) => {
      return new PublishVideoMediaReplacedInQueueHandler(messageBroker);
    },
    inject: ['IMenssageBroker'],
  },
};

export const VIDEOS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  VALIDATIONS,
  HANDLERS,
};
