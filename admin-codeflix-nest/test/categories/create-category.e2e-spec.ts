import request from 'supertest';

import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { CreateCategoryFixture } from '../../src/nest-modules/categories-module/testing/categoies.fixure';

describe('Categories (e2e)', () => {
  const helperApp = startApp();

  describe('/categories (POST)', () => {
    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();

      test.each(arrange)(
        'Create category with $send_data',
        async ({ send_data, expected }) => {
          const response = await request(helperApp.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          expect(Object.keys(response.body)).toEqual(['data']);
          expect(Object.keys(response.body.data)).toEqual(
            CreateCategoryFixture.keysInResponse,
          );

          expect(response.body.data).toMatchObject(expected);
        },
      );
    });

    describe('should not create a category with invalid body', () => {
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('Create category with $label', async ({ value }) => {
        await request(helperApp.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should not create a category with EntityValidationError', () => {
      const invalidRequest =
        CreateCategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('Create category with $label', async ({ value }) => {
        await request(helperApp.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });
  });
});
