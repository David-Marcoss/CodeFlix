import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import {
  CreateCategoryInput,
  CreateCategoryUseCase,
} from '../create-category.use-case';

describe('Create Category use-case integration tests', () => {
  let categoryRepository: CategorySequelizeRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should create a new category', async () => {
    const useCase = new CreateCategoryUseCase(categoryRepository);

    const input: CreateCategoryInput = {
      name: 'Test Category',
      description: 'Test Description',
      is_active: true,
    };

    const output = await useCase.execute(input);

    const categoryModel = await CategoryModel.findByPk(output.category_id);

    expect(categoryModel.toJSON()).toStrictEqual({
      category_id: output.category_id,
      name: output.name,
      description: output.description,
      is_active: output.is_active,
      created_at: output.created_at,
    });
  });
});
