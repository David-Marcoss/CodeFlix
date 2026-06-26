import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { GenreId } from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';

export class FindGenreUseCase implements IUseCase<
  GenreInput,
  GenreOutput | null
> {
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: GenreInput): Promise<GenreOutput | null> {
    const genreId = new GenreId(input.genre_id);
    const existingGenre = await this.genreRepo.getById(genreId);

    if (existingGenre) {
      const categories = await this.categoryRepo.findByIds(
        Array.from(existingGenre.categories_id.values()),
      );

      return GenreOutputMapper.toOutput(existingGenre, categories);
    }

    return null;
  }
}

interface GenreInput {
  genre_id: string;
}
