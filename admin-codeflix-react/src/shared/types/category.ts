import type { Meta } from "./meta";

export interface CategoryList {
  data: Category[];
  meta: Meta;
}

export interface Category {
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
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

