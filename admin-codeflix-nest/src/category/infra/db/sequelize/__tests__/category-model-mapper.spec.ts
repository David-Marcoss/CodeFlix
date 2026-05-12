import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryRepository } from "../category-sequelise.repository";
import { Category } from "../../../../domain/category.entity";
import { CategoryModelMapper } from "../category-model-mapper";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

describe("CategoryModelMapper Integration Tests", () => {
  let sequelize: Sequelize;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [CategoryModel],
    });
    categoryRepository = new CategoryRepository(CategoryModel);

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should convert a category model to a category aggregate", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });
});
