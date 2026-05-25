import { getModelToken } from '@nestjs/sequelize';

import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category/delete-category.use-case';
import { CategorySequelizeRepository } from '../../core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../core/category/infra/db/sequelize/category.model';
import { CategoryInMemoryRepository } from '../../core/category/infra/db/in-memory/category-in-memory.repsitory';
import { ICategoryRepository } from '../../core/category/domain/category.repository';
import { SearchCategoriesUseCase } from '../../core/category/application/use-cases/search-categories/search-categories.use-case';
import { FindCategoryUseCase } from '../../core/category/application/use-cases/find-category/find-category.use-case';

// isola os providers do módulo para facilitar a manutenção e reutilização

export const REPOSITORIES = {
  // repositorio default para ser injetado nos casos de uso, pode ser facilmente trocado para outro tipo de repositório (ex: in-memory) apenas alterando a configuração aqui
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository,
  },

  // repositório in-memory, pode ser utilizado para testes ou em cenários onde não é necessário persistência
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  // repositório Sequelize, responsável por interagir com o banco de dados usando Sequelize ORM
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel);
    },
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new CreateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new UpdateCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  SEARCH_CATEGORIES_USE_CASE: {
    provide: SearchCategoriesUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new SearchCategoriesUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: FindCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new FindCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new DeleteCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
