import { setupSequelize } from "../../../../../shared/infra/testing/helper";
import { CategoryId } from "../../../../domain/category.repository";
import { CategoryRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category/create-category.use-case";
import { FindCategoryUseCase } from "../find-category.use-case";

describe("Find Category use-case integration tests", () => {
  let categoryRepository: CategoryRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(CategoryModel);
  });

  it("should find a category", async () => {
    const useCase = new CreateCategoryUseCase(categoryRepository);

    const input = {
      name: "Test Category",
      description: "Test Description",
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

    const findUseCase = new FindCategoryUseCase(categoryRepository);

    const result = await findUseCase.execute({
      category_id: output.category_id,
    });

    expect(result).toStrictEqual({
      category_id: output.category_id,
      name: output.name,
      description: output.description,
      is_active: output.is_active,
      created_at: output.created_at,
    });
  });

  it("should throws error when entity not found", async () => {
    const categoryId = new CategoryId();
    const findUseCase = new FindCategoryUseCase(categoryRepository);

    const category = await findUseCase.execute({ category_id: categoryId.id });

    await expect(category).toBeNull();
  });
});
