import { Transform } from 'class-transformer';
import { GenreOutput } from '../../core/genre/application/use-cases/common/genre-output';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import { SearchGenreOutput } from '../../core/genre/application/use-cases/search-genres/search-genres.use-case';

export class GenrePresenter {
  genre_id: string;
  name: string;
  categories_id: string[];
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: GenreOutput) {
    this.genre_id = output.genre_id;
    this.name = output.name;
    this.categories_id = output.categories_id;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class GenreCollectionPresenter extends CollectionPresenter {
  data: GenrePresenter[];

  constructor(output: SearchGenreOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new GenrePresenter(i));
  }
}
