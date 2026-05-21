import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class FindAllCategoriesUseCase implements IUseCase<
  undefined,
  CategoryOutput[]
> {
  constructor(private categoryRepo: CategorySequelizeRepository) {}

  async execute(): Promise<CategoryOutput[]> {
    const categories = await this.categoryRepo.getAll();

    return categories.map((category) =>
      CategoryOutputMapper.toOutput(category),
    );
  }
}
