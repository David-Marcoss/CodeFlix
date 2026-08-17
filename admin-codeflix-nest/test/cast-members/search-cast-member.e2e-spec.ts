import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { ListCategoriesFixture } from '../../src/nest-modules/cast-members-module/testing/cast-member.fixure';
import { CAST_MEMBER_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.provider';
import { CastMemberModel } from '../../src/core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMembersController } from '../../src/nest-modules/cast-members-module/cast-members-module.controller';
import { CastMemberOutputMapper } from '../../src/core/cast-member/application/use-cases/common/cast-member-output';
import { VideoCastMemberModel } from '../../src/core/video/infra/sequelize/video-model';

async function clearCastMembers() {
  await VideoCastMemberModel.destroy({ where: {} });
  await CastMemberModel.destroy({ where: {} });
}

describe('CastMemberController (e2e)', () => {
  describe('/cast-member (GET)', () => {
    describe('should return cast-member sorted by created_at when request query is empty', () => {
      let castMemberRepo: ICastMemberRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        castMemberRepo = nestApp.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await clearCastMembers();
        await castMemberRepo.createMany(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/cast-member/?${queryParams}`)
            .authenticate(nestApp.app)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CastMembersController.serialize(
                    CastMemberOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return cast-member using paginate, filter and sort', () => {
      let castMemberRepo: ICastMemberRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        castMemberRepo = nestApp.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await clearCastMembers();
        await castMemberRepo.createMany(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/cast-member/?${queryParams}`)
            .authenticate(nestApp.app)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CastMembersController.serialize(
                    CastMemberOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
