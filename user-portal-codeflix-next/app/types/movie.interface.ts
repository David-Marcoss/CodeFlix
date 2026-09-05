export interface Movie {
  id: number;
  title: string;
  description: string;
  yearLaunched: string;
  link: string;
  castMembers: string[];
  genres: string[];
  thumbFileURL: string;
  bannerFileURL: string;
  videoFileURL: string;
  rating: string;
}

export interface PaginatedMovies {
  first: number;
  prev: null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Movie[];
}

