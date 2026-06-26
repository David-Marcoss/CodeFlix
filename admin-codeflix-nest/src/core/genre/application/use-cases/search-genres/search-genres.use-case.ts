import { CategoryId } from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { PaginationOutput } from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SearchParamsConstructorProps } from '../../../../shared/domain/repository/search-params';
import {
  GenreFilter,
  GenreSearchParams,
  IGenreRepository,
} from '../../../domain/genre.repository';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';

export class SearchGenresUseCase implements IUseCase<
  SearchGenreInput,
  SearchGenreOutput
> {
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: SearchGenreInput): Promise<SearchGenreOutput> {
    const params = GenreSearchParams.create({
      ...input,
      filter: input.filter ?? undefined,
    });
    const { items: _items, ...result } = await this.genreRepo.search(params);

    const categories_ids = new Set<CategoryId>();
    _items
      .flatMap((i) => Array.from(i.categories_id.values()))
      .forEach((i) => categories_ids.add(i));

    const categories = await this.categoryRepo.findByIds(
      Array.from(categories_ids.values()),
    );

    const items = _items.map((genre) => {
      const genreCategories = categories.filter((c) =>
        genre.categories_id.has(c.category_id.id),
      );
      return GenreOutputMapper.toOutput(genre, genreCategories);
    });

    return { ...result, items };
  }
}

export type SearchGenreInput = SearchParamsConstructorProps<GenreFilter>;
export type SearchGenreOutput = PaginationOutput<GenreOutput>;
