import { CategoryId } from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Genre } from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../validations/validate-categories-ids-exists-in-database';
import { CreateGenreInput } from './create-genre.input';

export { CreateGenreInput } from './create-genre.input';

export class CreateGenreUseCase implements IUseCase<
  CreateGenreInput,
  GenreOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
    private validateCategoriesIdsExistsInDatabaseUseCase: ValidateCategoriesIdsExistsInDatabaseUseCase,
  ) {}

  async execute(input: CreateGenreInput): Promise<GenreOutput> {
    await this.validateCategoriesIdsExistsInDatabaseUseCase.validate(
      input.categories_id,
    );

    const genre = Genre.create({
      ...input,
      categories_id: input.categories_id.map((id) => new CategoryId(id)),
    });

    if (genre.notification.hasErrors()) {
      throw new EntityValidationError(genre.notification.toJSON());
    }

    // execulta a operação em uma transação
    await this.uow.do(async () => {
      return await this.genreRepo.create(genre);
    });

    const categories = await this.categoryRepo.findByIds(
      Array.from(genre.categories_id.values()),
    );

    return GenreOutputMapper.toOutput(genre, categories);
  }
}
