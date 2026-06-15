import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import {
  CastMenberTypeEnum,
  CreateCastMemberInput,
} from '../../create-cast-member/create-cast-member.input';
import { CreateCastMemberUseCase } from '../../create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('Update CastMember use-case integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should update a castMember', async () => {
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

    const updateUseCase = new UpdateCastMemberUseCase(castMemberRepository);

    const result = await updateUseCase.execute({
      cast_member_id: output.cast_member_id,
      name: 'Updated CastMember',
      type: CastMenberTypeEnum.DIRECTOR,
    });

    expect(result).toStrictEqual({
      cast_member_id: output.cast_member_id,
      name: 'Updated CastMember',
      type: 'director',
      created_at: output.created_at,
    });
  });
});
