import { Category } from '../../../domain/category.aggregate';

export type CategoryOutput = {
  category_id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    return category.toJSON();
  }
}
