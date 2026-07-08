import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';

import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ListGenresFixture } from '../../src/nest-modules/genre-module/testing/genre.fixure';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genre-module/genre.provider';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../src/core/genre/infra/db/sequelize/genre-model';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.provider';
import { CategoryModel } from '../../src/core/category/infra/db/sequelize/category.model';

function makeQueryString(params: Record<string, any>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'filter') {
      Object.entries(value).forEach(([filterKey, filterValue]) => {
        if (Array.isArray(filterValue)) {
          filterValue.forEach((item) =>
            searchParams.append(`filter[${filterKey}][]`, String(item)),
          );
          return;
        }

        searchParams.append(`filter[${filterKey}]`, String(filterValue));
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

async function clearGenresData() {
  await GenreCategoryModel.destroy({ where: {} });
  await GenreModel.destroy({ where: {} });
  await CategoryModel.destroy({ where: {} });
}

function expectGenreResponse(received, entity, relations) {
  const categories = Array.from(entity.categories_id.values()).map(
    (categoryId) => relations.categories.get(categoryId.id),
  );

  expect(received).toMatchObject({
    genre_id: entity.genre_id.id,
    name: entity.name,
    is_active: entity.is_active,
    created_at: entity.created_at.toISOString(),
    categories_id: expect.arrayContaining(
      categories.map((category) => category.category_id.id),
    ),
    categories: expect.arrayContaining(
      categories.map((category) => ({
        id: category.category_id.id,
        name: category.name,
        created_at: expect.any(String),
      })),
    ),
  });
  expect(received.categories_id).toHaveLength(categories.length);
  expect(received.categories).toHaveLength(categories.length);
}

describe('GenreController (e2e)', () => {
  describe('/genres (GET)', () => {
    describe('should return genre sorted by created_at when request query is empty', () => {
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange, relations } =
        ListGenresFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await clearGenresData();
        await categoryRepo.createMany(Array.from(relations.categories.values()));
        await genreRepo.createMany(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = makeQueryString(send_data);
          const response = await request(nestApp.app.getHttpServer())
            .get(`/genres/?${queryParams}`)
            .expect(200);

          expect(response.body.meta).toStrictEqual(expected.meta);
          expect(response.body.data).toHaveLength(expected.entities.length);
          expected.entities.forEach((entity, index) =>
            expectGenreResponse(response.body.data[index], entity, relations),
          );
        },
      );
    });

    describe('should return genre using paginate, filter and sort', () => {
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange, relations } =
        ListGenresFixture.arrangeUnsorted();

      beforeEach(async () => {
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await clearGenresData();
        await categoryRepo.createMany(Array.from(relations.categories.values()));
        await genreRepo.createMany(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = makeQueryString(send_data);
          const response = await request(nestApp.app.getHttpServer())
            .get(`/genres/?${queryParams}`)
            .expect(200);

          expect(response.body.meta).toStrictEqual(expected.meta);
          expect(response.body.data).toHaveLength(expected.entities.length);
          expected.entities.forEach((entity, index) =>
            expectGenreResponse(response.body.data[index], entity, relations),
          );
        },
      );
    });
  });
});
