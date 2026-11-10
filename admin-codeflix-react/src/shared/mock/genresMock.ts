import type { Genre, GenresList } from "../types/genre";
import { categoriesMock } from "./categoriesMock";

export const genresMock: Genre[] = [
  "Ação",
  "Aventura",
  "Animação",
  "Comédia",
  "Documentário",
  "Drama",
  "Fantasia",
  "Ficção científica",
  "Romance",
  "Suspense",
  "Terror",
].map((name, index) => {
  const category = categoriesMock[index];

  return {
    genre_id: `a10b20c3-d456-4789-abcd-${String(index + 1).padStart(12, "0")}`,
    name,
    categories_id: [category.category_id],
    is_active: true,
    categories: [category],
    created_at: category.created_at,
  };
});

export const genresListMock: GenresList = {
  data: genresMock,
  meta: {
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: genresMock.length,
  },
};

export const genresListMockPage2: GenresList = {
  data: [genresMock[10]],
  meta: {
    current_page: 2,
    per_page: 10,
    last_page: 2,
    total: genresMock.length,
  },
};
