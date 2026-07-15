import { getConnectionToken, getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { CreateGenreUseCase } from '../../core/genre/application/use-cases/create-genre/create-genre.use-case';
import { UpdateGenreUseCase } from '../../core/genre/application/use-cases/update-genre/update-genre.use-case';

import { DeleteGenreUseCase } from '../../core/genre/application/use-cases/delete-genre/delete-genre.use-case';
import { IGenreRepository } from '../../core/genre/domain/genre.repository';
import { ICategoryRepository } from '../../core/category/domain/category.repository';

import { GenreSequelizeRepository } from '../../core/genre/infra/db/sequelize/genre-sequelize.repository';
import { GenreModel } from '../../core/genre/infra/db/sequelize/genre-model';
import { GenreInMemoryRepository } from '../../core/genre/infra/db/in-memory/genre-in-memory.repsitory';
import { UnitOfWorkSequelize } from '../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { IUnitOfWork } from '../../core/shared/domain/repository/unit-of-work-interface';
import { CATEGORY_PROVIDERS } from '../categories-module/categories.provider';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../core/genre/application/use-cases/validations/validate-genres-ids-exists-in-database';
import { SearchGenresUseCase } from '../../core/genre/application/use-cases/search-genres/search-genres.use-case';
import { FindGenreUseCase } from '../../core/genre/application/use-cases/find-genre/find-genre.use-case';

export const REPOSITORIES = {
  GENRE_REPOSITORY: {
    provide: 'GenreRepository',
    useExisting: GenreSequelizeRepository,
  },
  GENRE_IN_MEMORY_REPOSITORY: {
    provide: GenreInMemoryRepository,
    useClass: GenreInMemoryRepository,
  },
  GENRE_SEQUELIZE_REPOSITORY: {
    provide: GenreSequelizeRepository,
    useFactory: (genreModel: typeof GenreModel, uow: UnitOfWorkSequelize) => {
      return new GenreSequelizeRepository(genreModel, uow);
    },
    inject: [getModelToken(GenreModel), 'UnitOfWork'],
  },
};

export const UNIT_OF_WORK = {
  UNIT_OF_WORK_SEQUELIZE: {
    provide: 'UnitOfWork',
    useFactory: (sequelize: Sequelize) => {
      return new UnitOfWorkSequelize(sequelize);
    },
    inject: [getConnectionToken()],
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
};

export const USE_CASES = {
  CREATE_GENRE_USE_CASE: {
    provide: CreateGenreUseCase,
    useFactory: (
      uow: IUnitOfWork,
      genreRepo: IGenreRepository,
      categoryRepo: ICategoryRepository,
      validateCategoriesIdsExistsInDatabaseUseCase: ValidateCategoriesIdsExistsInDatabaseUseCase,
    ) => {
      return new CreateGenreUseCase(
        uow,
        genreRepo,
        categoryRepo,
        validateCategoriesIdsExistsInDatabaseUseCase,
      );
    },
    inject: [
      'UnitOfWork',
      REPOSITORIES.GENRE_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      VALIDATIONS.VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
    ],
  },
  UPDATE_GENRE_USE_CASE: {
    provide: UpdateGenreUseCase,
    useFactory: (
      uow: IUnitOfWork,
      genreRepo: IGenreRepository,
      categoryRepo: ICategoryRepository,
      validateCategoriesIdsExistsInDatabaseUseCase: ValidateCategoriesIdsExistsInDatabaseUseCase,
    ) => {
      return new UpdateGenreUseCase(
        uow,
        genreRepo,
        categoryRepo,
        validateCategoriesIdsExistsInDatabaseUseCase,
      );
    },
    inject: [
      'UnitOfWork',
      REPOSITORIES.GENRE_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      VALIDATIONS.VALIDATE_CATEGORIES_IDS_EXISTS_IN_DATABASE_USE_CASE.provide,
    ],
  },
  LIST_GENRES_USE_CASE: {
    provide: SearchGenresUseCase,
    useFactory: (
      genreRepo: IGenreRepository,
      categoryRepo: ICategoryRepository,
    ) => {
      return new SearchGenresUseCase(genreRepo, categoryRepo);
    },
    inject: [
      REPOSITORIES.GENRE_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    ],
  },
  GET_GENRE_USE_CASE: {
    provide: FindGenreUseCase,
    useFactory: (
      genreRepo: IGenreRepository,
      categoryRepo: ICategoryRepository,
    ) => {
      return new FindGenreUseCase(genreRepo, categoryRepo);
    },
    inject: [
      REPOSITORIES.GENRE_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    ],
  },
  DELETE_GENRE_USE_CASE: {
    provide: DeleteGenreUseCase,
    useFactory: (uow: IUnitOfWork, genreRepo: IGenreRepository) => {
      return new DeleteGenreUseCase(genreRepo, uow);
    },
    inject: ['UnitOfWork', REPOSITORIES.GENRE_REPOSITORY.provide],
  },
};

export const GENRES_PROVIDERS = {
  REPOSITORIES,
  UNIT_OF_WORK,
  USE_CASES,
  VALIDATIONS,
};
