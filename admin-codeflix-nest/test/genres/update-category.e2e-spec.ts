import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { CategoryModel } from '../../src/core/category/infra/db/sequelize/category.model';
import { Genre, GenreId } from '../../src/core/genre/domain/genre.aggregate';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { GenreOutputMapper } from '../../src/core/genre/application/use-cases/common/genre-output';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../src/core/genre/infra/db/sequelize/genre-model';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.provider';
import { GenreController } from '../../src/nest-modules/genre-module/genre.controller';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genre-module/genre.provider';
import { UpdateGenreFixture } from '../../src/nest-modules/genre-module/testing/genre.fixure';

describe('GenreController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  async function clearGenresData() {
    await GenreCategoryModel.destroy({ where: {} });
    await GenreModel.destroy({ where: {} });
    await CategoryModel.destroy({ where: {} });
  }

  describe('/genres/:id (PATCH)', () => {
    describe('should return an error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Genre.fake().aGenre();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message:
              'Genre Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/genres/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should return an error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateGenreFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/genres/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return an error when a category does not exist', () => {
      const app = startApp();
      const validationError =
        UpdateGenreFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let categoryRepo: ICategoryRepository;
      let genreRepo: IGenreRepository;

      beforeEach(async () => {
        categoryRepo = app.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        genreRepo = app.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        await clearGenresData();
      });

      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        const genre = Genre.fake()
          .aGenre()
          .addCategoryId(category.category_id)
          .build();

        await categoryRepo.create(category);
        await genreRepo.create(genre);

        return request(app.app.getHttpServer())
          .patch(`/genres/${genre.genre_id.id}`)
          .send(value.send_data)
          .expect(value.expected.statusCode)
          .expect(value.expected);
      });
    });

    describe('should update a genre', () => {
      const appHelper = startApp();
      const arrange = UpdateGenreFixture.arrangeForSave();
      let categoryRepo: ICategoryRepository;
      let genreRepo: IGenreRepository;

      beforeEach(async () => {
        categoryRepo = appHelper.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        genreRepo = appHelper.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        await clearGenresData();
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ entity, relations, send_data, expected }) => {
          await categoryRepo.createMany(relations.categories);
          await genreRepo.create(entity);

          const res = await request(appHelper.app.getHttpServer())
            .patch(`/genres/${entity.genre_id.id}`)
            .send(send_data)
            .expect(200);

          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(
            UpdateGenreFixture.keysInResponse,
          );

          const genreUpdated = await genreRepo.getById(
            new GenreId(res.body.data.genre_id),
          );
          const categories = await categoryRepo.findByIds(
            Array.from(genreUpdated!.categories_id.values()),
          );
          const presenter = GenreController.serialize(
            GenreOutputMapper.toOutput(genreUpdated!, categories),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toMatchObject({
            genre_id: serialized.genre_id,
            name: serialized.name,
            is_active: serialized.is_active,
            created_at: serialized.created_at,
            categories_id: expect.arrayContaining(serialized.categories_id),
            categories: expect.arrayContaining(serialized.categories),
          });
          expect(res.body.data).toMatchObject({
            genre_id: serialized.genre_id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
