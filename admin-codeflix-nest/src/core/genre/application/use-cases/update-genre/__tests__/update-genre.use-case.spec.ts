import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import {
  CreateGenreInput,
  CreateGenreUseCase,
} from '../../create-genre/create-genre.use-case';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../validations/validate-categories-ids-exists-in-database';
import { UpdateGenreUseCase } from '../update-genre.use-case';

describe('Update Genre use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWork: UnitOfWorkSequelize;
  let createUseCase: CreateGenreUseCase;
  let updateUseCase: UpdateGenreUseCase;
  let validateCategoriesIds: ValidateCategoriesIdsExistsInDatabaseUseCase;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWork = new UnitOfWorkSequelize(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWork);
    validateCategoriesIds = new ValidateCategoriesIdsExistsInDatabaseUseCase(
      categoryRepository,
    );
    createUseCase = new CreateGenreUseCase(
      unitOfWork,
      genreRepository,
      categoryRepository,
      validateCategoriesIds,
    );
    updateUseCase = new UpdateGenreUseCase(
      unitOfWork,
      genreRepository,
      categoryRepository,
      validateCategoriesIds,
    );
  });

  it('should update a genre', async () => {
    const categories = CategoryFakeBuilder.theCategories(4).build();
    await categoryRepository.createMany(categories);

    const input: CreateGenreInput = {
      name: 'Test Genre',
      categories_id: categories.slice(0, 2).map((c) => c.category_id.id),
      is_active: true,
    };
    const output = await createUseCase.execute(input);

    const updatedCategories = categories.slice(2, 4);
    const updatedCategoriesId = updatedCategories.map((c) => c.category_id.id);

    const result = await updateUseCase.execute({
      genre_id: output.genre_id,
      name: 'Updated Genre',
      categories_id: updatedCategoriesId,
      is_active: false,
    });

    expect(result).toStrictEqual({
      genre_id: output.genre_id,
      name: 'Updated Genre',
      categories_id: expect.arrayContaining(updatedCategoriesId),
      categories: expect.arrayContaining(
        updatedCategories.map((c) => ({
          id: c.category_id.id,
          name: c.name,
          created_at: c.created_at,
        })),
      ),
      is_active: false,
      created_at: output.created_at,
    });
    expect(result.categories_id).toHaveLength(2);
    expect(result.categories).toHaveLength(2);

    const genre = await genreRepository.getById(new GenreId(output.genre_id));

    expect(genre?.toJSON()).toStrictEqual({
      genre_id: output.genre_id,
      name: 'Updated Genre',
      categories_id: expect.arrayContaining(updatedCategoriesId),
      is_active: false,
      created_at: output.created_at,
    });
    expect(genre?.categories_id.size).toBe(2);
  });

  it('should update only provided fields', async () => {
    const categories = CategoryFakeBuilder.theCategories(2).build();
    await categoryRepository.createMany(categories);

    const output = await createUseCase.execute({
      name: 'Test Genre',
      categories_id: categories.map((c) => c.category_id.id),
      is_active: true,
    });

    const result = await updateUseCase.execute({
      genre_id: output.genre_id,
      name: 'Updated Genre',
    });

    expect(result).toStrictEqual({
      genre_id: output.genre_id,
      name: 'Updated Genre',
      categories_id: expect.arrayContaining(output.categories_id),
      categories: expect.arrayContaining(output.categories),
      is_active: true,
      created_at: output.created_at,
    });
    expect(result.categories_id).toHaveLength(2);
    expect(result.categories).toHaveLength(2);
  });

  it('should throw error when genre has invalid categories_id', async () => {
    const categories = CategoryFakeBuilder.theCategories(2).build();
    await categoryRepository.createMany(categories);

    const output = await createUseCase.execute({
      name: 'Test Genre',
      categories_id: categories.map((c) => c.category_id.id),
      is_active: true,
    });

    const invalidIds = [
      'c9cc0849-ee31-48a2-9503-7bec32445a8b',
      '82126de7-ff65-4405-b386-d81809b62e86',
    ];

    await expect(
      updateUseCase.execute({
        genre_id: output.genre_id,
        name: 'Updated Genre',
        categories_id: invalidIds,
      }),
    ).rejects.toThrow(new NotFoundError(invalidIds, Category));
  });

  it('should throw error when genre is not found', async () => {
    const genreId = new GenreId();

    await expect(
      updateUseCase.execute({
        genre_id: genreId.id,
        name: 'Updated Genre',
      }),
    ).rejects.toThrow(new NotFoundError(genreId.id, Genre));
  });

  it('should throw validation error when name is invalid', async () => {
    const categories = CategoryFakeBuilder.theCategories(2).build();
    await categoryRepository.createMany(categories);

    const output = await createUseCase.execute({
      name: 'Test Genre',
      categories_id: categories.map((c) => c.category_id.id),
      is_active: true,
    });

    await expect(
      updateUseCase.execute({
        genre_id: output.genre_id,
        name: 'a'.repeat(256),
      }),
    ).rejects.toBeInstanceOf(EntityValidationError);
  });
});
