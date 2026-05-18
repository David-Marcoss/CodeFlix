import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/notFoundError";
import { Category } from "../../../domain/category.entity";
import { CategoryId } from "../../../domain/category.repository";
import { CategoryRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import {
  CategoryOutput,
  CategoryOutputMapper,
} from "../common/category-output";

export class UpdateCategoryUseCase implements IUseCase<
  UpdateCategoryInput,
  CategoryOutput
> {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<CategoryOutput> {
    const category_id = new CategoryId(input.category_id);

    const existingCategory = await this.categoryRepo.getById(category_id);

    if (!existingCategory) {
      throw new NotFoundError(input.category_id, Category);
    }

    existingCategory.changeName(input.name);

    if (input.description !== undefined) {
      existingCategory.changeDescription(input.description);
    }

    if (input.is_active === true) {
      existingCategory.activate();
    }
    if (input.is_active === false) {
      existingCategory.deactivate();
    }

    this.categoryRepo.update(existingCategory);

    return CategoryOutputMapper.toOutput(existingCategory);
  }
}

export interface UpdateCategoryInput {
  category_id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}
