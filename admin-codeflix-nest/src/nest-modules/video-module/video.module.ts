import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories-module/categories.module';

import { VideoController } from './video.controller';
import { VIDEOS_PROVIDERS } from './video.provider';
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenresModel,
  VideoModel,
} from '../../core/video/infra/sequelize/video-model';
import { CastMembersModule } from '../cast-members-module/cast-members-module.module';
import { GenresModule } from '../genre-module/genre.module';
import { AudioVideoMediaModel } from '../../core/video/infra/sequelize/audio-video.model';
import { ImageMediaModel } from '../../core/video/infra/sequelize/image-media.model';
import { RabbitmqModule } from '../rabbitmq-module/rabbitmq.module';
import { VideoConsumer } from './video.consumers';

@Module({
  imports: [
    SequelizeModule.forFeature([
      VideoModel,
      VideoCategoryModel,
      VideoGenresModel,
      VideoCastMemberModel,
      AudioVideoMediaModel,
      ImageMediaModel,
    ]),
    RabbitmqModule.forFeature(),
    CategoriesModule,
    CastMembersModule,
    GenresModule,
  ],
  controllers: [VideoController],
  providers: [
    ...Object.values(VIDEOS_PROVIDERS.REPOSITORIES),
    ...Object.values(VIDEOS_PROVIDERS.USE_CASES),
    ...Object.values(VIDEOS_PROVIDERS.VALIDATIONS),
    ...Object.values(VIDEOS_PROVIDERS.HANDLERS),
    VideoConsumer,
  ],
  exports: [VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide],
})
export class VideosModule {}
