import type { Category } from "./category";
import type { Meta } from "./meta";

export interface Genre {
    genre_id: string;
    name: string;
    categories_id: string[];
    is_active: boolean;
    categories: Category[];
    created_at: Date;
}

export interface GenresList {
  data: Genre[];
  meta: Meta;
}


export interface GetGenreById {
  data: Genre;
}

export interface CreateGenre extends Omit<
  Genre,
  "genre_id" | "categories" | "created_at"
> {
  categories_id: string[];
}

export interface UpdateGenre extends Partial<CreateGenre> {
  genre_id: string;
}

