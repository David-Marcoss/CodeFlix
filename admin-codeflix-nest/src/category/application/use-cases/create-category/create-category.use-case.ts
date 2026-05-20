import { IUseCase } from "../../../../shared/application/use-case.interface";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryOutput } from "../common/category-output";
import { CreateCategoryInput } from "./create-category.input";

export class CreateCategoryUseCase implements IUseCase<
  CreateCategoryInput,
  CategoryOutput
> {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryOutput> {
    const category = Category.create(input);

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    this.categoryRepo.create(category);

    return category.toJSON();
  }
}
