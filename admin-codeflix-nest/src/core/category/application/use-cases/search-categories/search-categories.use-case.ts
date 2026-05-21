import { PaginationOutput } from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SearchParamsConstructorProps } from '../../../../shared/domain/repository/search-params';
import {
  CategoryFilter,
  CategorySearchParams,
} from '../../../domain/category.repository';
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class SearchCategoriesUseCase implements IUseCase<
  undefined,
  SearchCategoryOutput
> {
  constructor(private categoryRepo: CategorySequelizeRepository) {}

  async execute(filters?: SearchInput): Promise<SearchCategoryOutput> {
    const searchParams = new CategorySearchParams(filters);
    const categories = await this.categoryRepo.search(searchParams);

    const items = categories.items.map((model) =>
      CategoryOutputMapper.toOutput(model),
    );

    return {
      ...categories,
      items,
    };
  }
}

export type SearchInput = SearchParamsConstructorProps<CategoryFilter>;
export type SearchCategoryOutput = PaginationOutput<CategoryOutput>;
