import request from 'supertest';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genre-module/genre.provider';

import { CategoryFakeBuilder } from '../../src/core/category/domain/category-fake.builder';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.provider';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';

describe('GenreController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
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
            statusCode: 400,
            message: 'Validation failed (uuid is expected)',
            error: 'Bad Request',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(appHelper.app.getHttpServer())
          .delete(`/genres/${id}`)
          .authenticate(appHelper.app)

          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a genre response with status 204', async () => {
      const genreRepo = appHelper.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );

      const category = CategoryFakeBuilder.aCategory().build();

      const categoryRepo = appHelper.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      await categoryRepo.create(category);

      const genre = Genre.fake()
        .aGenre()
        .addCategoryId(category.category_id)
        .build();
      await genreRepo.create(genre);

      await request(appHelper.app.getHttpServer())
        .delete(`/genres/${genre.genre_id.id}`)
        .authenticate(appHelper.app)

        .expect(204);

      await expect(genreRepo.getById(genre.genre_id)).resolves.toBeNull();
    });
  });
});
