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

import { SearchGenresUseCase } from '../search-genres.use-case';

describe('Find all Genre use-case integration tests', () => {
  let genreRepository: GenreSequelizeRepository;
  let categoryRepository: CategorySequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelize;
  let useCase: SearchGenresUseCase;

  const setup = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelize(setup.sequelize);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    genreRepository = new GenreSequelizeRepository(GenreModel, unitOfWOrk);

    useCase = new SearchGenresUseCase(genreRepository, categoryRepository);
  });

  it('should search all genres', async () => {
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

    const result = await useCase.execute({});

    const items = result.items;
    const resultGenre1 = items.find((i) => i.genre_id === genre.genre_id.id);
    const resultGenre2 = items.find((i) => i.genre_id === genre2.genre_id.id);
    const resultGenre3 = items.find((i) => i.genre_id === genre3.genre_id.id);

    expect(items).toHaveLength(3);
    expect(genre?.toJSON()).toStrictEqual({
      genre_id: resultGenre1?.genre_id,
      name: resultGenre1?.name,
      categories_id: expect.arrayContaining(resultGenre1?.categories_id ?? []),
      is_active: resultGenre1?.is_active,
      created_at: resultGenre1?.created_at,
    });

    expect(genre2?.toJSON()).toStrictEqual({
      genre_id: resultGenre2?.genre_id,
      name: resultGenre2?.name,
      categories_id: expect.arrayContaining(resultGenre2?.categories_id ?? []),
      is_active: resultGenre2?.is_active,
      created_at: resultGenre2?.created_at,
    });

    expect(genre3?.toJSON()).toStrictEqual({
      genre_id: resultGenre3?.genre_id,
      name: resultGenre3?.name,
      categories_id: expect.arrayContaining(resultGenre3?.categories_id ?? []),
      is_active: resultGenre3?.is_active,
      created_at: resultGenre3?.created_at,
    });
  });

  it('should filter genre by name', async () => {
    const categories = CategoryFakeBuilder.theCategories(5).build();

    await categoryRepository.createMany(categories);

    const genre = GenreFakeBuilder.aGenre()
      .withName('Genero generoso')
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

    const result = await useCase.execute({
      filter: { name: 'Genero generoso' },
    });

    const items = result.items;
    const resultGenre1 = items.find((i) => i.genre_id === genre.genre_id.id);

    expect(items).toHaveLength(1);
    expect(genre?.toJSON()).toStrictEqual({
      genre_id: resultGenre1?.genre_id,
      name: resultGenre1?.name,
      categories_id: expect.arrayContaining(resultGenre1?.categories_id ?? []),
      is_active: resultGenre1?.is_active,
      created_at: resultGenre1?.created_at,
    });
  });

  it('should filter genre by categoryId', async () => {
    const categories = CategoryFakeBuilder.theCategories(5).build();

    await categoryRepository.createMany(categories);

    const genre = GenreFakeBuilder.aGenre()
      .withName('Genero generoso')
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

    const result = await useCase.execute({
      filter: { categories_id: [categories[0].category_id] },
    });

    const items = result.items;
    const resultGenre1 = items.find((i) => i.genre_id === genre.genre_id.id);

    expect(items).toHaveLength(1);
    expect(genre?.toJSON()).toStrictEqual({
      genre_id: resultGenre1?.genre_id,
      name: resultGenre1?.name,
      categories_id: expect.arrayContaining(resultGenre1?.categories_id ?? []),
      is_active: resultGenre1?.is_active,
      created_at: resultGenre1?.created_at,
    });
  });
});
