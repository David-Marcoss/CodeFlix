import { SequelizeOptions } from 'sequelize-typescript';
import { setupSequelize } from '../../../../shared/infra/testing/helper';
import { ImageMediaModel } from '../image-media.model';
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenresModel,
  VideoModel,
} from '../video-model';
import { AudioVideoMediaModel } from '../audio-video.model';
import { CategoryModel } from '../../../../category/infra/db/sequelize/category.model';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../genre/infra/db/sequelize/genre-model';
import { CastMemberModel } from '../../../../cast-member/infra/db/sequelize/cast-member.model';

export function setupSequelizeForVideo(options: SequelizeOptions = {}) {
  return setupSequelize({
    models: [
      ImageMediaModel,
      VideoModel,
      AudioVideoMediaModel,
      VideoCategoryModel,
      CategoryModel,
      VideoGenresModel,
      GenreModel,
      GenreCategoryModel,
      VideoCastMemberModel,
      CastMemberModel,
    ],
    ...options,
  });
}
