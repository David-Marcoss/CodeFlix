import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.provider';

import { GENRES_PROVIDERS } from '../../src/nest-modules/genre-module/genre.provider';

import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { CategoryFakeBuilder } from '../../src/core/category/domain/category-fake.builder';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { GetGenreFixture } from '../../src/nest-modules/genre-module/testing/genre.fixure';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();
  describe('/genres/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Genre Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/genres/${id}`)
          .authenticate(nestApp.app)

          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a genre ', async () => {
      const genreRepo = nestApp.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );

      const category = CategoryFakeBuilder.aCategory().build();

      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      await categoryRepo.create(category);

      const genre = Genre.fake()
        .aGenre()
        .addCategoryId(category.category_id)
        .build();
      await genreRepo.create(genre);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/genres/${genre.genre_id.id}`)
        .authenticate(nestApp.app)

        .expect(200);
      const keyInResponse = GetGenreFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
    });
  });
});
