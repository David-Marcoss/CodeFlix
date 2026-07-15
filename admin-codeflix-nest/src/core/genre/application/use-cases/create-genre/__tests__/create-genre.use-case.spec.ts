import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { CreateGenreInput, CreateGenreUseCase } from '../create-genre.use-case';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { GenreId } from '../../../../domain/genre.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { Category } from '../../../../../category/domain/category.aggregate';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../../../../category/application/use-cases/validations/validate-categories-ids-exists-in-database';

describe('Create Genre use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelize;
  let validateCategoriesIds: ValidateCategoriesIdsExistsInDatabaseUseCase;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelize(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWOrk);
    validateCategoriesIds = new ValidateCategoriesIdsExistsInDatabaseUseCase(
      categoryRepository,
    );
  });

  it('should create a new genre', async () => {
    const useCase = new CreateGenreUseCase(
      unitOfWOrk,
      genreRepository,
      categoryRepository,
      validateCategoriesIds,
    );

    const categories = CategoryFakeBuilder.theCategories(3).build();

    await categoryRepository.createMany(categories);

    const input: CreateGenreInput = {
      name: 'Test Genre',
      categories_id: categories.map((c) => c.category_id.id),
      is_active: true,
    };

    const output = await useCase.execute(input);

    const genre = await genreRepository.getById(new GenreId(output.genre_id));

    expect(genre?.toJSON()).toStrictEqual({
      genre_id: output.genre_id,
      name: output.name,
      categories_id: expect.arrayContaining(output.categories_id),
      is_active: output.is_active,
      created_at: output.created_at,
    });
  });

  it('should throw error when genre has invalid categories_id', async () => {
    const useCase = new CreateGenreUseCase(
      unitOfWOrk,
      genreRepository,
      categoryRepository,
      validateCategoriesIds,
    );

    const invalidIds = [
      'c9cc0849-ee31-48a2-9503-7bec32445a8b',
      '82126de7-ff65-4405-b386-d81809b62e86',
    ];

    await expect(
      useCase.execute({
        name: 'Test Genre',
        categories_id: invalidIds,
        is_active: true,
      }),
    ).rejects.toThrow(new NotFoundError(invalidIds, Category));
  });
});
