import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { Genre, GenreId } from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';

export class ValidateGenresIdsExistsInDatabaseUseCase {
  constructor(private repo: IGenreRepository) {}

  async validate(genres_id: string[]): Promise<void> {
    const result = await this.repo.existsById(
      genres_id.map((i) => new GenreId(i)),
    );

    if (result.not_exists.length > 0) {
      throw new NotFoundError(result.not_exists, Genre);
    }
  }
}
