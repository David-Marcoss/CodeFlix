import { Chance } from 'chance';
import { GenreFakeBuilder } from '../genre-fake.builder';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CategoryId } from '../../../category/domain/category.aggregate';

describe('GenreFakerBuilder Unit Tests', () => {
  describe('genre_id prop', () => {
    const faker = GenreFakeBuilder.aGenre();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.genre_id).toThrow(
        new Error("Property genre_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_genre_id']).toBeUndefined();
    });

    test('withGenreId', () => {
      const genre_id = new Uuid();
      const $this = faker.withGenreId(genre_id);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_genre_id']).toBe(genre_id);

      faker.withGenreId(() => genre_id);
      //@ts-expect-error _genre_id is a callable
      expect(faker['_genre_id']()).toBe(genre_id);

      expect(faker.genre_id).toBe(genre_id);
    });

    test('should pass index to genre_id factory', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withGenreId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const genreId = new Uuid();
      mockFactory = jest.fn(() => genreId);
      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withGenreId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].genre_id).toBe(genreId);
      expect(fakerMany.build()[1].genre_id).toBe(genreId);
    });
  });

  describe('name prop', () => {
    const faker = GenreFakeBuilder.aGenre();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');

      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const genre = faker.build();
      expect(genre.name).toBe(`test name 0`);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('categories_id prop', () => {
    const faker = GenreFakeBuilder.aGenre();
    test('should be a function', () => {
      expect(typeof faker['_categories_id']).toBe('object');
    });

    test('addCategoryId', () => {
      const categoryId = new CategoryId();
      const $this = faker.addCategoryId(categoryId);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_categories_id'].length).toBe(1);

      const categoryId2 = new CategoryId();
      faker.addCategoryId(categoryId2);

      expect(faker['_categories_id'].length).toBe(2);

      expect(faker.categories_id[0]).toBe(categoryId);
      expect(faker.categories_id[1]).toBe(categoryId2);
    });

    test('should pass index to categories_id factory', () => {
      const faker = GenreFakeBuilder.aGenre();
      faker.addCategoryId(() => new CategoryId());
      const genre = faker.build();
      expect(genre.categories_id.size).toBe(1);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.addCategoryId(() => new CategoryId());
      const categories = fakerMany.build();

      expect(categories[0].categories_id.size).toBe(1);
      expect(categories[1].categories_id.size).toBe(1);
    });
  });

  describe('is_active prop', () => {
    const faker = GenreFakeBuilder.aGenre();
    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe('created_at prop', () => {
    const faker = GenreFakeBuilder.aGenre();

    test('should throw error when any with methods has called', () => {
      const fakerGenre = GenreFakeBuilder.aGenre();
      expect(() => fakerGenre.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_created_at']()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const genre = faker.build();
      expect(genre.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a genre', () => {
    const faker = GenreFakeBuilder.aGenre();
    let genre = faker.build();

    expect(genre.genre_id).toBeInstanceOf(Uuid);
    expect(typeof genre.name === 'string').toBeTruthy();
    expect(genre.is_active).toBe(true);
    expect(genre.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const genre_id = new Uuid();
    genre = faker
      .withGenreId(genre_id)
      .withName('name test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(genre.genre_id.id).toBe(genre_id.id);
    expect(genre.name).toBe('name test');
    expect(genre.is_active).toBe(false);
    expect(genre.created_at).toBe(created_at);
  });

  test('should create many categories', () => {
    const faker = GenreFakeBuilder.theGenres(2);
    let categories = faker.build();

    categories.forEach((genre) => {
      expect(genre.genre_id).toBeInstanceOf(Uuid);
      expect(typeof genre.name === 'string').toBeTruthy();
      expect(genre.is_active).toBe(true);
      expect(genre.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const genre_id = new Uuid();
    categories = faker
      .withGenreId(genre_id)
      .withName('name test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    categories.forEach((genre) => {
      expect(genre.genre_id.id).toBe(genre_id.id);
      expect(genre.name).toBe('name test');
      expect(genre.is_active).toBe(false);
      expect(genre.created_at).toBe(created_at);
    });
  });
});
