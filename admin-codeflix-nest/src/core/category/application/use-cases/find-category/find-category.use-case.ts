import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CategoryId } from '../../../domain/category.repository';
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class FindCategoryUseCase implements IUseCase<
  CategoryInput,
  CategoryOutput | null
> {
  constructor(private categoryRepo: CategorySequelizeRepository) {}

  async execute(input: CategoryInput): Promise<CategoryOutput | null> {
    const categoryId = new CategoryId(input.category_id);
    const existingCategory = await this.categoryRepo.getById(categoryId);

    if (existingCategory) {
      return CategoryOutputMapper.toOutput(existingCategory);
    }

    return null;
  }
}

interface CategoryInput {
  category_id: string;
}
