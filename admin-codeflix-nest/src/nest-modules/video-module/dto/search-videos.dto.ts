export class SearchVideosDto {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
  filter?: {
    title?: string;
    categories_id?: string[];
    genres_id?: string[];
    cast_members_id?: string[];
  };
}
