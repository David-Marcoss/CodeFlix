import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';

export type CategoryFilter = string | undefined;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export class CategoryId extends Uuid {}
export interface ICategoryRepository extends ISearchableRepository<
  Category,
  CategoryId,
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult
> {}
