import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Category } from '../../../domain/category.entity';
import {
  CategoryId,
  ICategoryRepository,
} from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';
import { UpdateCategoryInput } from './update-category.input';

export class UpdateCategoryUseCase implements IUseCase<
  UpdateCategoryInput,
  CategoryOutput
> {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<CategoryOutput> {
    const category_id = new CategoryId(input.category_id);

    const existingCategory = await this.categoryRepo.getById(category_id);

    if (!existingCategory) {
      throw new NotFoundError(input.category_id, Category);
    }

    if (input.name) {
      existingCategory.changeName(input.name);
    }

    if (input.description !== undefined) {
      existingCategory.changeDescription(input.description);
    }

    if (input.is_active === true) {
      existingCategory.activate();
    }
    if (input.is_active === false) {
      existingCategory.deactivate();
    }

    if (existingCategory.notification.hasErrors()) {
      throw new EntityValidationError(existingCategory.notification.toJSON());
    }

    await this.categoryRepo.update(existingCategory);

    return CategoryOutputMapper.toOutput(existingCategory);
  }
}
