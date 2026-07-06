import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../domain/genre.aggregate';

export type GenreCategoryOutput = {
  id: string;
  name: string;
  created_at: Date;
};

export type GenreOutput = {
  genre_id: string;
  name: string;
  categories_id: string[];
  categories: GenreCategoryOutput[];
  is_active: boolean;
  created_at: Date;
};

export class GenreOutputMapper {
  static toOutput(genre: Genre, categories: Category[]): GenreOutput {
    return {
      ...genre.toJSON(),
      categories: categories.map((c) => ({
        id: c.category_id.id,
        name: c.name,
        created_at: c.created_at,
      })),
    };
  }
}
