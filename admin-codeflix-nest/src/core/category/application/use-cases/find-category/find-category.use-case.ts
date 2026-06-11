import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CategoryId } from '../../../domain/category.aggregate';
import { ICategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class FindCategoryUseCase implements IUseCase<
  CategoryInput,
  CategoryOutput | null
> {
  constructor(private categoryRepo: ICategoryRepository) {}

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
