import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from '../categories.controller';
import { CategoriesModule } from '../categories.module';
import { ConfigModule } from '../../config-module/config.module';
import { DatabaseModule } from '../../database-module/database.module';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { Category } from '../../../core/category/domain/category.aggregate';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a category', async () => {
    const data: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const result = await controller.create(data);

    expect(result.name).toBe(data.name);
    expect(result.description).toBe(data.description);
    expect(result.is_active).toBe(data.is_active);
  });

  it('should find a category', async () => {
    const data: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const created = await controller.create(data);

    const result = await controller.findOne(created.category_id);

    expect(result?.category_id).toBe(created.category_id);
    expect(result?.name).toBe(created.name);
    expect(result?.description).toBe(created.description);
    expect(result?.is_active).toBe(created.is_active);
  });

  it('should not find a category', async () => {
    const category_id = new Uuid().toString();
    const result = await controller.findOne(category_id);

    expect(result).toBeNull();
  });

  it('should search categories', async () => {
    const category1: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    await controller.create(category1);

    const category2: CreateCategoryDto = {
      name: 'Series',
      description: 'some description',
      is_active: true,
    };

    await controller.create(category2);

    let result = await controller.search({ page: 1, per_page: 10 });

    expect(result.data.length).toBeGreaterThanOrEqual(2);
    expect(result.meta.total).toBeGreaterThanOrEqual(2);

    result = await controller.search({ filter: 'Series' });

    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.meta.total).toBeGreaterThanOrEqual(1);
    expect(result.data[0].name).toBe(category2.name);
  });

  it('should delete a category', async () => {
    const data: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const created = await controller.create(data);

    const result = await controller.delete(created.category_id);

    expect(result).toBeUndefined();

    const findResult = await controller.findOne(created.category_id);

    expect(findResult).toBeNull();
  });

  it('should not delete a category when it does not exist', async () => {
    const category_id = new Uuid().toString();

    await expect(controller.delete(category_id)).rejects.toThrow(
      new NotFoundError(category_id, Category),
    );
  });

  it('should update a category', async () => {
    const data: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const created = await controller.create(data);

    const updateData: UpdateCategoryDto = {
      name: 'Updated Movie',
      description: 'updated description',
      is_active: false,
    };

    const result = await controller.update(created.category_id, updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.description).toBe(updateData.description);
    expect(result.is_active).toBe(updateData.is_active);
  });

  it('should not update a category when it does not exist', async () => {
    const category_id = new Uuid().toString();

    await expect(
      controller.update(category_id, { name: 'Updated Movie' }),
    ).rejects.toThrow(new NotFoundError(category_id, Category));
  });
});
