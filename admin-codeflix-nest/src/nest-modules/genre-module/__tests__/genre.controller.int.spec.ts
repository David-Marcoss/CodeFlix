import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from '../genre.controller';

import { DatabaseModule } from '../../database-module/database.module';
import { GenresModule } from '../genre.module';
import { ConfigModule } from '../../config-module/config.module';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { Category } from '../../../core/category/domain/category.aggregate';
import { CATEGORY_PROVIDERS } from '../../categories-module/categories.provider';
import { ICategoryRepository } from '../../../core/category/domain/category.repository';
import { CategoryFakeBuilder } from '../../../core/category/domain/category-fake.builder';
import { IGenreRepository } from '../../../core/genre/domain/genre.repository';
import { GENRES_PROVIDERS } from '../genre.provider';
import { GenreFakeBuilder } from '../../../core/genre/domain/genre-fake.builder';
import { Genre } from '../../../core/genre/domain/genre.aggregate';

describe('GenreController', () => {
  let controller: GenreController;
  let categoryRepo: ICategoryRepository;
  let genreRepo: IGenreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, GenresModule],
    }).compile();

    controller = module.get<GenreController>(GenreController);

    categoryRepo = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    genreRepo = module.get(
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create a genre', () => {
    it('Should create a genre', async () => {
      const categories = CategoryFakeBuilder.theCategories(3).build();

      await categoryRepo.createMany(categories);
      const categories_id = categories.map((c) => c.category_id.id);

      const data: CreateGenreDto = {
        name: 'Movie',
        categories_id,
        is_active: true,
      };

      const result = await controller.create(data);

      expect(result.name).toBe(data.name);
      expect(result.categories_id).toStrictEqual(data.categories_id);
      expect(result.is_active).toBe(data.is_active);
    });

    it('should not create a genre with invalid categories', async () => {
      const categories_id = ['f47ac10b-58cc-4372-a567-0e02b2c3d479'];

      const data: CreateGenreDto = {
        name: 'Movie',
        categories_id,
        is_active: true,
      };

      await expect(controller.create(data)).rejects.toThrow(
        new NotFoundError(categories_id, Category),
      );
    });
  });

  describe('Find a genre', () => {
    it('Should find a genre', async () => {
      const categories = CategoryFakeBuilder.theCategories(2).build();

      await categoryRepo.createMany(categories);

      const genre = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .build();

      await genreRepo.create(genre);

      const result = await controller.findOne(genre.genre_id.id);

      expect(result.genre_id).toStrictEqual(genre.genre_id.id);
      expect(result.name).toStrictEqual(genre.name);
      expect(result.categories_id).toStrictEqual(
        expect.arrayContaining(genre.toJSON().categories_id),
      );
      expect(result.is_active).toStrictEqual(genre.is_active);
    });

    it('should not find a genre with invalid ID', async () => {
      const genre_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      await expect(controller.findOne(genre_id)).rejects.toThrow(
        new NotFoundError(genre_id, Genre),
      );
    });
  });

  describe('Search a genre', () => {
    it('Should get all genres', async () => {
      const categories = CategoryFakeBuilder.theCategories(2).build();

      await categoryRepo.createMany(categories);

      const genre = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .build();

      const genre2 = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[1].category_id)
        .build();

      await genreRepo.createMany([genre, genre2]);

      const result = await controller.search();

      expect(result.data).toHaveLength(2);

      expect(result.data[0].genre_id).toStrictEqual(genre.genre_id.id);
      expect(result.data[0].name).toStrictEqual(genre.name);
      expect(result.data[0].categories_id).toStrictEqual(
        expect.arrayContaining(genre.toJSON().categories_id),
      );
      expect(result.data[0].is_active).toStrictEqual(genre.is_active);

      expect(result.data[1].genre_id).toStrictEqual(genre2.genre_id.id);
      expect(result.data[1].name).toStrictEqual(genre2.name);
      expect(result.data[1].categories_id).toStrictEqual(
        expect.arrayContaining(genre2.toJSON().categories_id),
      );
      expect(result.data[1].is_active).toStrictEqual(genre2.is_active);
    });

    it('Should filter a genre by name', async () => {
      const categories = CategoryFakeBuilder.theCategories(2).build();

      await categoryRepo.createMany(categories);

      const genre = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .build();

      const genre2 = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[1].category_id)
        .build();

      await genreRepo.createMany([genre, genre2]);

      const result = await controller.search({ filter: { name: genre.name } });

      expect(result.data).toHaveLength(1);

      expect(result.data[0].genre_id).toStrictEqual(genre.genre_id.id);
      expect(result.data[0].name).toStrictEqual(genre.name);
      expect(result.data[0].categories_id).toStrictEqual(
        expect.arrayContaining(genre.toJSON().categories_id),
      );
      expect(result.data[0].is_active).toStrictEqual(genre.is_active);
    });
  });

  describe('Delete a genre', () => {
    it('Should delete a genre', async () => {
      const categories = CategoryFakeBuilder.theCategories(2).build();

      await categoryRepo.createMany(categories);

      const genre = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .build();

      await genreRepo.create(genre);

      const result = await controller.delete(genre.genre_id.id);

      expect(result).toBeUndefined();

      await expect(genreRepo.getById(genre.genre_id)).resolves.toBeNull();
    });

    it('should not Delete a genre with invalid ID', async () => {
      const genre_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      await expect(controller.delete(genre_id)).rejects.toThrow(
        new NotFoundError(genre_id, Genre),
      );
    });
  });

  describe('Update a genre', () => {
    it('Should update a genre', async () => {
      const categories = CategoryFakeBuilder.theCategories(2).build();

      await categoryRepo.createMany(categories);

      const genre = GenreFakeBuilder.aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .build();

      await genreRepo.create(genre);

      const othersCategories = CategoryFakeBuilder.theCategories(2).build();
      await categoryRepo.createMany(othersCategories);
      const categories_id = othersCategories.map((c) => c.category_id.id);

      const result = await controller.update(genre.genre_id.id, {
        name: 'Updated Name',
        categories_id,
      });

      expect(result.genre_id).toStrictEqual(genre.genre_id.id);
      expect(result.name).toStrictEqual('Updated Name');
      expect(result.categories_id).toStrictEqual(
        expect.arrayContaining(categories_id),
      );
      expect(result.is_active).toStrictEqual(genre.is_active);
    });

    it('should not update a genre with invalid ID', async () => {
      const genre_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      await expect(
        controller.update(genre_id, { name: 'Updated Name' }),
      ).rejects.toThrow(new NotFoundError(genre_id, Genre));
    });
  });
});
