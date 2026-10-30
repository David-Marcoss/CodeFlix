export interface CategoryList {
  data: Category[];
  meta: Meta;
}

export interface Category {
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
}

export interface GetCategoryById {
  data: Category;
}

export interface CreateCategory {
  name: string;
  description: string;
  is_active: boolean;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  category_id: string;
}

export interface Meta {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
}

export interface SearchParams {
  search?: string;
  page?: number;
  perPage?: number;
}
