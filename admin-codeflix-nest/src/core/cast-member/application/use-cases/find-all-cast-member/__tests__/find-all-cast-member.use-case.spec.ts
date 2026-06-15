import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import {
  CastMenberTypeEnum,
  CreateCastMemberInput,
} from '../../create-cast-member/create-cast-member.input';
import { CreateCastMemberUseCase } from '../../create-cast-member/create-cast-member.use-case';
import { FindAllCategoriesUseCase } from '../find-all-cast-member.use-case';

describe('Find all CastMember use-case integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should find all cast-member', async () => {
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

    const findAllUseCase = new FindAllCategoriesUseCase(castMemberRepository);

    const result = await findAllUseCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toStrictEqual({
      cast_member_id: output.cast_member_id,
      name: output.name,
      type: output.type,
      created_at: output.created_at,
    });
  });
});
