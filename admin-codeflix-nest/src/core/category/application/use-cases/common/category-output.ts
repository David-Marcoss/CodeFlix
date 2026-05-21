import { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
  category_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    return category.toJSON();
  }
}
