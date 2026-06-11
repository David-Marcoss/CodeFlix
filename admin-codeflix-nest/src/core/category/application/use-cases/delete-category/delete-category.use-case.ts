import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CategoryId } from '../../../domain/category.aggregate';
import { ICategoryRepository } from '../../../domain/category.repository';

export class DeleteCategoryUseCase implements IUseCase<CategoryInput, void> {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: CategoryInput): Promise<void> {
    const categoryId = new CategoryId(input.category_id);

    await this.categoryRepo.delete(categoryId);
  }
}

interface CategoryInput {
  category_id: string;
}
