import { setupSequelize } from "../../../../../shared/infra/testing/helper";
import { CategoryRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category/create-category.use-case";
import { SearchCategoriesUseCase } from "../search-categories.use-case";

describe("Find all Category use-case integration tests", () => {
  let categoryRepository: CategoryRepository;
  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(CategoryModel);
  });

  it("should search category by name", async () => {
    const createUseCase = new CreateCategoryUseCase(categoryRepository);

    const category1 = {
      name: "caregoria 1",
      description: "Test Description",
      is_active: true,
    };

    const category2 = {
      name: "Category 2",
      description: "Test Description 2",
      is_active: true,
    };

    await createUseCase.execute(category1);
    await createUseCase.execute(category2);

    const findAllUseCase = new SearchCategoriesUseCase(categoryRepository);

    const result = await findAllUseCase.execute({ filter: "caregoria 1" });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.current_page).toBe(1);
    expect(result.last_page).toBe(1);
    expect(result.per_page).toBe(15);

    expect(result.items[0].name).toBe(category1.name);
    expect(result.items[0].description).toBe(category1.description);
    expect(result.items[0].is_active).toBe(category1.is_active);
  });
});
