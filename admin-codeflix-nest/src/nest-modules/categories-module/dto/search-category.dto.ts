import { SearchCategoryInput } from '../../../core/category/application/use-cases/search-categories/search-categories.use-case';

export class SearchCategoriesDto implements SearchCategoryInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
  filter?: string;
}
