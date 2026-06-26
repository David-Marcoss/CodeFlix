import {
  Category,
  CategoryId,
} from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';

export class ValidateCategoriesIdsExistsInDatabaseUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async validate(categories_id: string[]): Promise<void> {
    const result = await this.categoryRepo.existsById(
      categories_id.map((i) => new CategoryId(i)),
    );

    if (result.not_exists.length > 0) {
      throw new NotFoundError(result.not_exists, Category);
    }
  }
}
