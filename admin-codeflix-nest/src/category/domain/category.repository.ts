import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";
import { IRepository } from "../../shared/domain/repository/repository-interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";

export interface CategoryRepository extends IRepository<Category, Uuid> {}

export type CategoryFilter = string | undefined;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}