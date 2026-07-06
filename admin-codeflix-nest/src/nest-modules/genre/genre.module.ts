import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories-module/categories.module';

import {
  GenreCategoryModel,
  GenreModel,
} from '../../core/genre/infra/db/sequelize/genre-model';
import { GenreController } from './genre.controller';
import { GENRES_PROVIDERS } from './genre.provider';

@Module({
  imports: [
    SequelizeModule.forFeature([GenreModel, GenreCategoryModel]),
    CategoriesModule,
  ],
  controllers: [GenreController],
  providers: [
    ...Object.values(GENRES_PROVIDERS.UNIT_OF_WORK),
    ...Object.values(GENRES_PROVIDERS.REPOSITORIES),
    ...Object.values(GENRES_PROVIDERS.USE_CASES),
    ...Object.values(GENRES_PROVIDERS.VALIDATIONS),
  ],
  exports: [
    GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    GENRES_PROVIDERS.VALIDATIONS
      .VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE,
  ],
})
export class GenresModule {}
