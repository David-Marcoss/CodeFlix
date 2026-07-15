import { CategoryId } from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Genre, GenreId } from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../validations/validate-genres-ids-exists-in-database';
import { UpdateGenreInput } from './update-genre.input';

export class UpdateGenreUseCase implements IUseCase<
  UpdateGenreInput,
  GenreOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
    private validateCategoriesIdsExistsInDatabaseUseCase: ValidateCategoriesIdsExistsInDatabaseUseCase,
  ) {}

  async execute(input: UpdateGenreInput): Promise<GenreOutput> {
    if (input.categories_id) {
      await this.validateCategoriesIdsExistsInDatabaseUseCase.validate(
        input.categories_id,
      );
    }

    const genre_id = new GenreId(input.genre_id);

    const existingGenre = await this.genreRepo.getById(genre_id);

    if (!existingGenre) {
      throw new NotFoundError(input.genre_id, Genre);
    }

    if (input.name) {
      existingGenre.changeName(input.name);
    }

    if (input.categories_id !== undefined) {
      existingGenre.syncCategoriesId(
        input.categories_id.map((i) => new CategoryId(i)),
      );
    }

    if (input.is_active === true) {
      existingGenre.activate();
    }
    if (input.is_active === false) {
      existingGenre.deactivate();
    }

    if (existingGenre.notification.hasErrors()) {
      throw new EntityValidationError(existingGenre.notification.toJSON());
    }

    await this.uow.do(async () => await this.genreRepo.update(existingGenre));

    const categories = await this.categoryRepo.findByIds(
      Array.from(existingGenre.categories_id.values()),
    );

    return GenreOutputMapper.toOutput(existingGenre, categories);
  }
}
