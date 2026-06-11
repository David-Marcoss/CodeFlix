import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.aggregate';

describe('Category Unit Tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category.prototype, 'validate');
  });

  afterEach(() => {
    validateSpy.mockRestore();
  });
  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeUndefined();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test('should create a category with all values', () => {
      const created_at = new Date();
      const category_id = new Uuid();
      const category = new Category({
        category_id,
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      });

      expect(category.category_id.equals(category_id)).toBe(true);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });
    test('should create a category with name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      });

      expect(category.name).toBe('Movie');
      expect(category.description).toBeUndefined();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'some description',
      });

      expect(category.name).toBe('Movie');
      expect(category.description).toBe('some description');
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a category with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      });

      expect(category.name).toBe('Movie');
      expect(category.description).toBeUndefined();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];
    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
    });
  });

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });
    category.changeName('other name');
    expect(category.name).toBe('other name');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });
    category.changeDescription('some description');
    expect(category.description).toBe('some description');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should active a category', () => {
    const category = Category.create({
      name: 'Filmes',
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
  });

  test('should disable a category', () => {
    const category = Category.create({
      name: 'Filmes',
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
  });
});

describe('Category Validator', () => {
  describe('create command', () => {
    test('should an invalid category with name property', () => {
      const category = Category.create({ name: 't'.repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid category using name property', () => {
      const category = Category.create({ name: 'Movie' });
      category.changeName('t'.repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
