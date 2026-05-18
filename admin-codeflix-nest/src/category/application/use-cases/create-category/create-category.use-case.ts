import { IUseCase } from "../../../../shared/application/use-case.interface";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryOutput } from "../common/category-output";

export class CreateCategoryUseCase implements IUseCase<
  CreateCategoryInput,
  CategoryOutput
> {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryOutput> {
    const category = Category.create(input);

    this.categoryRepo.create(category);

    return category.toJSON();
  }
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  is_active?: boolean;
}
