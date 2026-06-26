import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { GenreId } from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';

export class DeleteGenreUseCase implements IUseCase<GenreInput, void> {
  constructor(
    private genreRepo: IGenreRepository,
    private uow: IUnitOfWork,
  ) {}

  async execute(input: GenreInput): Promise<void> {
    const genreId = new GenreId(input.genre_id);

    await this.uow.do(async () => await this.genreRepo.delete(genreId));
  }
}

interface GenreInput {
  genre_id: string;
}
