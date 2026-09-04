import { Movie } from '../types/movie.interface';
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
  return await apiRequest<Movie[]>(
    `/movies`,
    { 'genre:contains': genre },
    options
  );
};

export const SearchMovies = async (
  title: string = '',
  genre: string = '',
  options?: RequestOptions
): Promise<Movie[]> => {
  return await apiRequest<Movie[]>(
    `/movies`,
    { 'title:contains': title, 'genre:contains': genre },
    options
  );
};
