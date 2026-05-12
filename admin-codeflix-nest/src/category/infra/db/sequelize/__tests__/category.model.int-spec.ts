import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryFakeBuilder } from "../../../../../category/domain/category-fake.builder";

describe("Category model integration tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [CategoryModel],
    });

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("validate category model props", () => {
    const categoryProps = Object.keys(CategoryModel.getAttributes());
    expect(categoryProps).toEqual([
      "category_id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);
  });

  it("should create a category", async () => {
    const category = CategoryFakeBuilder.aCategory().build();

    const categoryModel = await CategoryModel.create({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });

    expect(categoryModel.toJSON()).toStrictEqual({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
