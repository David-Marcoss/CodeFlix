import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CastMemberId } from '../../../../domain/cast-member.aggregate';

import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import {
  CastMenberTypeEnum,
  CreateCastMemberInput,
} from '../../create-cast-member/create-cast-member.input';
import { CreateCastMemberUseCase } from '../../create-cast-member/create-cast-member.use-case';
import { FindCastMemberUseCase } from '../find-cast-member.use-case';

describe('Find CastMember use-case integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should find a castMember', async () => {
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

    const findUseCase = new FindCastMemberUseCase(castMemberRepository);

    const result = await findUseCase.execute({
      cast_member_id: output.cast_member_id,
    });

    expect(result).toStrictEqual({
      cast_member_id: output.cast_member_id,
      name: output.name,
      type: output.type,
      created_at: output.created_at,
    });
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    const findUseCase = new FindCastMemberUseCase(castMemberRepository);

    const castMember = await findUseCase.execute({
      cast_member_id: castMemberId.id,
    });

    await expect(castMember).toBeNull();
  });
});
