import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { setupSequelize } from '../../../../../shared/infra/testing/helper';
import { GenreFakeBuilder } from '../../../../domain/genre-fake.builder';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';

import { FindAllGenresUseCase } from '../find-all-genres.use-case';

describe('Find all Genre use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelize;
  let useCase: FindAllGenresUseCase;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelize(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWOrk);

    useCase = new FindAllGenresUseCase(genreRepository, categoryRepository);
  });

  it('should find all categories', async () => {
    const categories = CategoryFakeBuilder.theCategories(5).build();

    await categoryRepository.createMany(categories);

    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();

    const genre2 = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[2].category_id)
      .addCategoryId(categories[3].category_id)
      .build();

    const genre3 = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[1].category_id)
      .addCategoryId(categories[4].category_id)
      .build();

    await genreRepository.createMany([genre, genre2, genre3]);

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(genre?.toJSON()).toStrictEqual({
      genre_id: result[0].genre_id,
      name: result[0].name,
      categories_id: expect.arrayContaining(result[0].categories_id),
      is_active: result[0].is_active,
      created_at: result[0].created_at,
    });

    expect(genre2?.toJSON()).toStrictEqual({
      genre_id: result[1].genre_id,
      name: result[1].name,
      categories_id: expect.arrayContaining(result[1].categories_id),
      is_active: result[1].is_active,
      created_at: result[1].created_at,
    });

    expect(genre3?.toJSON()).toStrictEqual({
      genre_id: result[2].genre_id,
      name: result[2].name,
      categories_id: expect.arrayContaining(result[2].categories_id),
      is_active: result[2].is_active,
      created_at: result[2].created_at,
    });
  });
});
