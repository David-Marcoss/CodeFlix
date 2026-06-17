import { Genre, GenreId } from './genre.aggregate';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';

export type GenreFilter = string | undefined;

export class GenreSearchParams extends SearchParams<GenreFilter> {}

export class GenreSearchResult extends SearchResult<Genre> {}

export interface IGenreRepository extends ISearchableRepository<
  Genre,
  GenreId,
  GenreFilter,
  GenreSearchParams,
  GenreSearchResult
> {}
