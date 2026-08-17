import request from 'supertest';

import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.provider';
import { CreateGenreFixture } from '../../src/nest-modules/genre-module/testing/genre.fixure';

describe('Genre (e2e)', () => {
  const helperApp = startApp();

  describe('/genres (POST)', () => {
    describe('should create a genre', () => {
      const arrange = CreateGenreFixture.arrangeForCreate();

      test.each(arrange)(
        'Create genre with $send_data',
        async ({ send_data, expected, relations }) => {
          const categoryRepo = helperApp.app.get<ICategoryRepository>(
            CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
          );

          await categoryRepo.createMany(relations.categories);

          const response = await request(helperApp.app.getHttpServer())
            .post('/genres')
            .authenticate(helperApp.app)
            .send(send_data)
            .expect(201);

          expect(Object.keys(response.body)).toEqual(['data']);
          expect(Object.keys(response.body.data)).toEqual(
            CreateGenreFixture.keysInResponse,
          );

          expect(response.body.data).toMatchObject(expected);
        },
      );
    });

    describe('should not create a genre with invalid body', () => {
      const invalidRequest = CreateGenreFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('Create genre with $label', async ({ value }) => {
        await request(helperApp.app.getHttpServer())
          .post('/genres')
          .authenticate(helperApp.app)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should not create a genre with NotFoundError', () => {
      const invalidRequest =
        CreateGenreFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('Create genre with $label', async ({ value }) => {
        await request(helperApp.app.getHttpServer())
          .post('/genres')
          .authenticate(helperApp.app)
          .send(value.send_data)
          .expect(value.expected.statusCode)
          .expect(value.expected);
      });
    });
  });
});
