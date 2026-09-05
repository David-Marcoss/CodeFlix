import { Movie, PaginatedMovies } from '../types/movie.interface';
import { apiRequest, RequestOptions } from './api-request';

export const getMovieById = async (id: string): Promise<Movie> => {
  return await apiRequest<Movie>(`/movies/${id}`);
};

export const getFeaturedById = async (id: string): Promise<Movie> => {
  return await apiRequest<Movie>(`/featured/${id}`);
};

export const getMoviesByGenre = async (
  genre: string,
  options?: RequestOptions
): Promise<Movie[]> => {
  const { data: movies } = await apiRequest<PaginatedMovies>(`movies`, undefined, {
    ...options,
    _page: 1,
    _per_page: 1000,
  });

  const filteredMovies = movies.filter((movie) => movie.genres.includes(genre));

  if (options?._per_page) {
    return filteredMovies.slice(0, options._per_page);
  }

  return filteredMovies;
};

export const SearchMovies = async (
  title: string = '',
  options?: RequestOptions
): Promise<Movie[]> => {
  return await apiRequest<Movie[]>(
    `/movies`,
    { 'title:contains': title },
    options
  );
};
