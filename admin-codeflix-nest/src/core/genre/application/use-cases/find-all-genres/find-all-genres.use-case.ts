import { CategoryId } from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IGenreRepository } from '../../../domain/genre.repository';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';

export class FindAllGenresUseCase implements IUseCase<
  undefined,
  GenreOutput[]
> {
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(): Promise<GenreOutput[]> {
    const genres = await this.genreRepo.getAll();

    const categories_ids = new Set<CategoryId>();
    genres
      .flatMap((i) => Array.from(i.categories_id.values()))
      .forEach((i) => categories_ids.add(i));

    const categories = await this.categoryRepo.findByIds(
      Array.from(categories_ids.values()),
    );

    return genres.map((genre) => {
      const genreCategories = categories.filter((c) =>
        genre.categories_id.has(c.category_id.id),
      );
      return GenreOutputMapper.toOutput(genre, genreCategories);
    });
  }
}
