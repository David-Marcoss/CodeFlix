import request from 'supertest';

import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { CreateCastMemberFixture } from '../../src/nest-modules/cast-members-module/testing/cast-member.fixure';

describe('Categories (e2e)', () => {
  const helperApp = startApp();

  describe('/cast-member (POST)', () => {
    describe('should create a castMember', () => {
      const arrange = CreateCastMemberFixture.arrangeForCreate();

      test.each(arrange)(
        'Create castMember with $send_data',
        async ({ send_data, expected }) => {
          const response = await request(helperApp.app.getHttpServer())
            .post('/cast-member')
            .send(send_data)
            .expect(201);

          expect(Object.keys(response.body)).toEqual(['data']);
          expect(Object.keys(response.body.data)).toEqual(
            CreateCastMemberFixture.keysInResponse,
          );

          expect(response.body.data).toMatchObject(expected);
        },
      );

      it('Create castMember with $send_data', async () => {
        const { send_data, expected } =
          CreateCastMemberFixture.arrangeForCreate()[0];

        const response = await request(helperApp.app.getHttpServer())
          .post('/cast-member')
          .send(send_data)
          .expect(201);

        expect(Object.keys(response.body)).toEqual(['data']);
        expect(Object.keys(response.body.data)).toEqual(
          CreateCastMemberFixture.keysInResponse,
        );

        expect(response.body.data).toMatchObject(expected);
      });
    });

    describe('should not create a castMember with invalid body', () => {
      const invalidRequest = CreateCastMemberFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('Create castMember with $label', async ({ value }) => {
        await request(helperApp.app.getHttpServer())
          .post('/cast-member')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    // describe('should not create a castMember with EntityValidationError', () => {
    //   const invalidRequest =
    //     CreateCastMemberFixture.arrangeForEntityValidationError();

    //   const arrange = Object.keys(invalidRequest).map((key) => ({
    //     label: key,
    //     value: invalidRequest[key],
    //   }));

    //   test.each(arrange)('Create castMember with $label', async ({ value }) => {
    //     await request(helperApp.app.getHttpServer())
    //       .post('/cast-member')
    //       .send(value.send_data)
    //       .expect(422)
    //       .expect(value.expected);
    //   });
    // });
  });
});
