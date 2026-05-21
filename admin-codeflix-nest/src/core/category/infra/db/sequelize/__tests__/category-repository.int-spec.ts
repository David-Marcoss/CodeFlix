import { CategoryModel } from '../category.model';
import { CategoryFakeBuilder } from '../../../../domain/category-fake.builder';
import { CategoryRepository } from '../category-sequelize.repository';
import { Category } from '../../../../domain/category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../domain/category.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';

describe('Category repository integration tests', () => {
  let categoryRepository: CategoryRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(CategoryModel);
  });

  it('should create a new category', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);

    const categoryModel = await CategoryModel.findByPk(category.category_id.id);

    expect(categoryModel.toJSON()).toStrictEqual({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it('should find a category', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);

    const findCategory = await categoryRepository.getById(category.category_id);

    expect(findCategory.toJSON()).toEqual(category.toJSON());
  });

  it('should find all categories', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    const category2 = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);
    await categoryRepository.create(category2);

    const findCategory = await categoryRepository.getAll();

    expect(findCategory.length).toBe(2);
    expect(findCategory[0].toJSON()).toEqual(category.toJSON());
    expect(findCategory[1].toJSON()).toEqual(category2.toJSON());
  });

  it('should find all categories with pagination', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    const category2 = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);
    await categoryRepository.create(category2);

    const result = await categoryRepository.search(new CategorySearchParams());

    expect(result).toEqual(
      new CategorySearchResult({
        items: [category2, category],
        total: 2,
        current_page: 1,
        per_page: 15,
      }),
    );
  });

  it('should delete a category', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);

    const findCategory = await categoryRepository.getById(category.category_id);

    expect(findCategory.toJSON()).toEqual(category.toJSON());

    await categoryRepository.delete(category.category_id);

    const findCategoryDeleted = await categoryRepository.getById(
      category.category_id,
    );

    expect(findCategoryDeleted).toBeNull();
  });

  it('should to throw error when delete category is not found', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await expect(
      categoryRepository.delete(category.category_id),
    ).rejects.toThrow(new NotFoundError(category.category_id, Category));
  });

  it('should update a category', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await categoryRepository.create(category);

    const findCategory = await categoryRepository.getById(category.category_id);

    expect(findCategory.toJSON()).toEqual(category.toJSON());

    const categoryUpdated = new Category({
      category_id: category.category_id,
      name: 'updated name',
      description: 'updated description',
      is_active: false,
      created_at: category.created_at,
    });

    await categoryRepository.update(categoryUpdated);

    const findCategoryUpdated = await categoryRepository.getById(
      category.category_id,
    );

    expect(findCategoryUpdated.toJSON()).toEqual(categoryUpdated.toJSON());
  });

  it('should to throw error when update category is not found', async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    await expect(categoryRepository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id, Category),
    );
  });
});
