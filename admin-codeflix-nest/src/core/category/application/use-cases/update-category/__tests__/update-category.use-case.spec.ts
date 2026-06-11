import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CreateCategoryUseCase } from '../../create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('Update Category use-case integration tests', () => {
  let categoryRepository: CategorySequelizeRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should update a category', async () => {
    const useCase = new CreateCategoryUseCase(categoryRepository);

    const input = {
      name: 'Test Category',
      description: 'Test Description',
      is_active: true,
    };

    const output = await useCase.execute(input);

    const categoryModel = await CategoryModel.findByPk(output.category_id);

    expect(categoryModel!.toJSON()).toStrictEqual({
      category_id: output.category_id,
      name: output.name,
      description: output.description,
      is_active: output.is_active,
      created_at: output.created_at,
    });

    const updateUseCase = new UpdateCategoryUseCase(categoryRepository);

    const result = await updateUseCase.execute({
      category_id: output.category_id,
      name: 'Updated Category',
      description: 'Updated Description',
      is_active: false,
    });

    expect(result).toStrictEqual({
      category_id: output.category_id,
      name: 'Updated Category',
      description: 'Updated Description',
      is_active: false,
      created_at: output.created_at,
    });
  });
});
