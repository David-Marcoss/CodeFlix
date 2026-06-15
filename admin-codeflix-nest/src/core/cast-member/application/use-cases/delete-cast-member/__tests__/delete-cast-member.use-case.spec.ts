import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import {
  CastMenberTypeEnum,
  CreateCastMemberInput,
} from '../../create-cast-member/create-cast-member.input';
import { CreateCastMemberUseCase } from '../../create-cast-member/create-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';

describe('Delete CastMember use-case integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should delete a new castMember', async () => {
    const useCase = new CreateCastMemberUseCase(castMemberRepository);

    const input: CreateCastMemberInput = {
      name: 'Test CastMember',
      type: CastMenberTypeEnum.ACTOR,
    };

    const output = await useCase.execute(input);

    const castMemberModel = await CastMemberModel.findByPk(
      output.cast_member_id,
    );

    expect(castMemberModel!.toJSON()).toStrictEqual({
      cast_member_id: output.cast_member_id,
      name: output.name,
      type: output.type,
      created_at: output.created_at,
    });

    const deleteUseCase = new DeleteCastMemberUseCase(castMemberRepository);

    await deleteUseCase.execute({ cast_member_id: output.cast_member_id });

    const getcastMemberModel = await CastMemberModel.findByPk(
      output.cast_member_id,
    );

    expect(getcastMemberModel).toBeNull();
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    const deleteUseCase = new DeleteCastMemberUseCase(castMemberRepository);

    await expect(
      deleteUseCase.execute({ cast_member_id: castMemberId.id }),
    ).rejects.toThrow(new NotFoundError(castMemberId, CastMember));
  });
});
