import { setupSequelize } from "../../../../../shared/infra/testing/helper";
import { CategoryRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category/create-category.use-case";
import { FindAllCategoriesUseCase } from "../find-all-categories.use-case";

describe("Find all Category use-case integration tests", () => {
  let categoryRepository: CategoryRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(CategoryModel);
  });

  it("should find all categories", async () => {
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

    const findAllUseCase = new FindAllCategoriesUseCase(categoryRepository);

    const result = await findAllUseCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toStrictEqual({
      category_id: output.category_id,
      name: output.name,
      description: output.description,
      is_active: output.is_active,
      created_at: output.created_at,
    });
  });
});
