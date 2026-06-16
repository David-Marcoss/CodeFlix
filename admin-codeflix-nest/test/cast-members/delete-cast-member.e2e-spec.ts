import request from 'supertest';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { CastMember } from '../../src/core/cast-member/domain/cast-member.aggregate';
import { CAST_MEMBER_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.provider';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'CastMember Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
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
          .delete(`/cast-member/${id}`)

          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a castMember response with status 204', async () => {
      const castMemberRepo = appHelper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().aCastMember().build();
      await castMemberRepo.create(castMember);

      await request(appHelper.app.getHttpServer())
        .delete(`/cast-member/${castMember.cast_member_id.id}`)

        .expect(204);

      await expect(
        castMemberRepo.getById(castMember.cast_member_id),
      ).resolves.toBeNull();
    });
  });
});
