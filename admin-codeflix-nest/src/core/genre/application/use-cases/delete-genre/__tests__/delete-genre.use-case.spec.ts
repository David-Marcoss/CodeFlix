import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { UnitOfWorkSequelise } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { GenreFakeBuilder } from '../../../../domain/genre-fake.builder';
import { DeleteGenreUseCase } from '../delete-genre.use-case';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';

describe('Delete Category use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelise;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelise(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWOrk);
  });

  it('should delete a new category', async () => {
    const categories = CategoryFakeBuilder.theCategories(2).build();

    await categoryRepository.createMany(categories);

    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();

    await genreRepository.create(genre);

    const deleteUseCase = new DeleteGenreUseCase(genreRepository, unitOfWOrk);

    await deleteUseCase.execute({ genre_id: genre.genre_id.id });

    const getgenreModel = await GenreModel.findByPk(genre.genre_id.id);

    expect(getgenreModel).toBeNull();
  });

  it('should throws error when entity not found', async () => {
    const genreId = new GenreId();
    const deleteUseCase = new DeleteGenreUseCase(genreRepository, unitOfWOrk);

    await expect(
      deleteUseCase.execute({ genre_id: genreId.id }),
    ).rejects.toThrow(new NotFoundError(genreId, Genre));
  });
});
