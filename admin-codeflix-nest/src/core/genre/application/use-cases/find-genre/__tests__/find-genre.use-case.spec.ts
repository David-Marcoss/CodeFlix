import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { UnitOfWorkSequelise } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { GenreFakeBuilder } from '../../../../domain/genre-fake.builder';
import { GenreId } from '../../../../domain/genre.aggregate';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';

import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';

import { FindGenreUseCase } from '../find-genre.use-case';

describe('Find Genre use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelise;
  let useCase: FindGenreUseCase;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelise(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWOrk);

    useCase = new FindGenreUseCase(genreRepository, categoryRepository);
  });

  it('should find a genre', async () => {
    const categories = CategoryFakeBuilder.theCategories(2).build();

    await categoryRepository.createMany(categories);

    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();

    await genreRepository.create(genre);

    const result = await useCase.execute({ genre_id: genre.genre_id.id });

    expect(genre?.toJSON()).toStrictEqual({
      genre_id: result?.genre_id,
      name: result?.name,
      categories_id: expect.arrayContaining(result!.categories_id),
      is_active: result?.is_active,
      created_at: result?.created_at,
    });
  });

  it('should throws error when entity not found', async () => {
    const genreId = new GenreId();

    const genre = await useCase.execute({ genre_id: genreId.id });

    await expect(genre).toBeNull();
  });
});
