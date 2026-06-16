import { getModelToken } from '@nestjs/sequelize';
import { CastMemberSequelizeRepository } from '../../core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberInMemoryRepository } from '../../core/cast-member/infra/db/in-memory/cast-member-in-memory.repsitory';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member.model';
import { CreateCastMemberUseCase } from '../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { ICastMemberRepository } from '../../core/cast-member/domain/cast-member.repository';
import { UpdateCastMemberUseCase } from '../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { SearchCastMembersUseCase } from '../../core/cast-member/application/use-cases/search-cast-member/search-cast-member.use-case';
import { FindCastMemberUseCase } from '../../core/cast-member/application/use-cases/find-cast-member/find-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';

// isola os providers do módulo para facilitar a manutenção e reutilização

export const REPOSITORIES = {
  // repositorio default para ser injetado nos casos de uso, pode ser facilmente trocado para outro tipo de repositório (ex: in-memory) apenas alterando a configuração aqui
  CAST_MEMBER_REPOSITORY: {
    provide: 'CastMemberRepository',
    useExisting: CastMemberSequelizeRepository,
  },

  // repositório in-memory, pode ser utilizado para testes ou em cenários onde não é necessário persistência
  CAST_MEMBER_IN_MEMORY_REPOSITORY: {
    provide: CastMemberInMemoryRepository,
    useClass: CastMemberInMemoryRepository,
  },
  // repositório Sequelize, responsável por interagir com o banco de dados usando Sequelize ORM
  CAST_MEMBER_SEQUELIZE_REPOSITORY: {
    provide: CastMemberSequelizeRepository,
    useFactory: (castMemberModel: typeof CastMemberModel) => {
      return new CastMemberSequelizeRepository(castMemberModel);
    },
    inject: [getModelToken(CastMemberModel)],
  },
};

export const USE_CASES = {
  CREATE_CAST_MEMBER_USE_CASE: {
    provide: CreateCastMemberUseCase,
    useFactory: (castMamberRepo: ICastMemberRepository) => {
      return new CreateCastMemberUseCase(castMamberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  UPDATE_CAST_MEMBER_USE_CASE: {
    provide: UpdateCastMemberUseCase,
    useFactory: (castMamberRepo: ICastMemberRepository) => {
      return new UpdateCastMemberUseCase(castMamberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  SEARCH_CATEGORIES_USE_CASE: {
    provide: SearchCastMembersUseCase,
    useFactory: (castMamberRepo: ICastMemberRepository) => {
      return new SearchCastMembersUseCase(castMamberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  GET_CAST_MEMBER_USE_CASE: {
    provide: FindCastMemberUseCase,
    useFactory: (castMamberRepo: ICastMemberRepository) => {
      return new FindCastMemberUseCase(castMamberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  DELETE_CAST_MEMBER_USE_CASE: {
    provide: DeleteCastMemberUseCase,
    useFactory: (castMamberRepo: ICastMemberRepository) => {
      return new DeleteCastMemberUseCase(castMamberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
};

export const CAST_MEMBER_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
