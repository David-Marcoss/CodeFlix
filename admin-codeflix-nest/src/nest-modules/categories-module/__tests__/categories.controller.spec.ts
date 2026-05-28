import { CategoriesController } from '../categories.controller';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { Category } from '../../../core/category/domain/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryOutput } from '../../../core/category/application/use-cases/common/category-output';
import { SearchCategoryOutput } from '../../../core/category/application/use-cases/search-categories/search-categories.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a category', async () => {
    //Arrange
    const output: CategoryOutput = {
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const result = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toStrictEqual(output);
  });

  it('should find a category', async () => {
    //Arrange
    const output: CategoryOutput = {
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    const result = await controller.findOne(output.category_id);

    expect(result?.category_id).toBe(output.category_id);
    expect(result?.name).toBe(output.name);
    expect(result?.description).toBe(output.description);
    expect(result?.is_active).toBe(output.is_active);
  });

  it('should not find a category', async () => {
    const category_id = new Uuid().toString();

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    const result = await controller.findOne(category_id);

    expect(result).toBeNull();
  });

  it('should search categories', async () => {
    const output: SearchCategoryOutput = {
      items: [
        {
          category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockSearchUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['searchUseCase'] = mockSearchUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockSearchUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
  });

  it('should delete a category', async () => {
    const category_id = new Uuid().toString();

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    const result = await controller.delete(category_id);

    expect(result).toBeNull();
  });

  it('should not delete a category when it does not exist', async () => {
    const category_id = new Uuid().toString();

    const mockDeleteUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(
          Promise.reject(new NotFoundError(category_id, Category)),
        ),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    await expect(controller.delete(category_id)).rejects.toThrow(
      new NotFoundError(category_id, Category),
    );
  });

  it('should update a category', async () => {
    const category_id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: CategoryOutput = {
      category_id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.update(category_id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      category_id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should not update a category when it does not exist', async () => {
    const category_id = new Uuid().toString();

    const mockUpdateUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(
          Promise.reject(new NotFoundError(category_id, Category)),
        ),
    };

    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;

    await expect(
      controller.update(category_id, { name: 'Updated Movie' }),
    ).rejects.toThrow(new NotFoundError(category_id, Category));
  });
});
