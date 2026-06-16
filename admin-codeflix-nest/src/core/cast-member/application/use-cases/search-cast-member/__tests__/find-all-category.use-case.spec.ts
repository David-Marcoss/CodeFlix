import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import {
  CastMenberTypeEnum,
  CreateCastMemberInput,
} from '../../create-cast-member/create-cast-member.input';
import { CreateCastMemberUseCase } from '../../create-cast-member/create-cast-member.use-case';
import { SearchCastMembersUseCase } from '../search-cast-member.use-case';

describe('Find all CastMember use-case integration tests', () => {
  let castMemberRepository: CastMemberSequelizeRepository;
  setupSequelize({
    models: [CastMemberModel],
  });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should search castMember by name', async () => {
    const createUseCase = new CreateCastMemberUseCase(castMemberRepository);

    const castMember1: CreateCastMemberInput = {
      name: 'Test CastMember 1',
      type: CastMenberTypeEnum.ACTOR,
    };

    const castMember2: CreateCastMemberInput = {
      name: 'Test CastMember 2',
      type: CastMenberTypeEnum.DIRECTOR,
    };

    await createUseCase.execute(castMember1);
    await createUseCase.execute(castMember2);

    const findAllUseCase = new SearchCastMembersUseCase(castMemberRepository);

    const result = await findAllUseCase.execute({
      filter: 'Test CastMember 1',
    });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.current_page).toBe(1);
    expect(result.last_page).toBe(1);
    expect(result.per_page).toBe(15);

    expect(result.items[0].name).toBe(castMember1.name);
    expect(result.items[0].type).toBe(castMember1.type);
  });
});
