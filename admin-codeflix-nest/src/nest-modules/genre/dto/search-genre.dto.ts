export class SearchGenresDto {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
  filter?: {
    name?: string;
    categories_id?: string[];
  };
}
