import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { Category } from '../../../../domain/category.entity';
import { CategoryId } from '../../../../domain/category.repository';
import { CategoryRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CreateCategoryUseCase } from '../../create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('Delete Category use-case integration tests', () => {
  let categoryRepository: CategoryRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(CategoryModel);
  });

  it('should delete a new category', async () => {
    const useCase = new CreateCategoryUseCase(categoryRepository);

    const input = {
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

    const deleteUseCase = new DeleteCategoryUseCase(categoryRepository);

    await deleteUseCase.execute({ category_id: output.category_id });

    const getcategoryModel = await CategoryModel.findByPk(output.category_id);

    expect(getcategoryModel).toBeNull();
  });

  it('should throws error when entity not found', async () => {
    const categoryId = new CategoryId();
    const deleteUseCase = new DeleteCategoryUseCase(categoryRepository);

    await expect(
      deleteUseCase.execute({ category_id: categoryId.id }),
    ).rejects.toThrow(new NotFoundError(categoryId, Category));
  });
});
