import { GenreController } from '../genre.controller';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '../../../core/shared/domain/errors/notFoundError';
import { Genre } from '../../../core/genre/domain/genre.aggregate';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { GenreOutput } from '../../../core/genre/application/use-cases/common/genre-output';
import { GenreCollectionPresenter, GenrePresenter } from '../genre.presenter';
import { SearchGenreOutput } from '../../../core/genre/application/use-cases/search-genres/search-genres.use-case';
import { SearchGenresDto } from '../dto/search-genre.dto';

describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    controller = new GenreController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a genre', async () => {
    //Arrange
    const output: GenreOutput = {
      genre_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
      categories: [
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Action',
          created_at: new Date(),
        },
      ],
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateGenreDto = {
      name: 'Movie',
      categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
      is_active: true,
    };

    const result = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toStrictEqual(new GenrePresenter(output));
  });

  it('should find a genre', async () => {
    //Arrange
    const output: GenreOutput = {
      genre_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
      categories: [
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Action',
          created_at: new Date(),
        },
      ],
      is_active: true,
      created_at: new Date(),
    };

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    const result = await controller.findOne(output.genre_id);

    expect(result?.genre_id).toBe(output.genre_id);
    expect(result?.name).toBe(output.name);
    expect(result?.categories_id).toBe(output.categories_id);
    expect(result?.is_active).toBe(output.is_active);
  });

  it('should not find a genre', async () => {
    const genre_id = new Uuid().toString();

    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['findUseCase'] = mockFindUseCase;

    await expect(controller.findOne(genre_id)).rejects.toThrow(
      new NotFoundError(genre_id, Genre),
    );
  });

  it('should search genre', async () => {
    const output: SearchGenreOutput = {
      items: [
        {
          genre_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
          categories: [
            {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              name: 'Action',
              created_at: new Date(),
            },
          ],
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
    const searchParams: SearchGenresDto = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: {
        name: 'test',
      },
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(GenreCollectionPresenter);
    expect(mockSearchUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new GenreCollectionPresenter(output));
  });

  it('should delete a genre', async () => {
    const genre_id = new Uuid().toString();

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(null)),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    const result = await controller.delete(genre_id);

    expect(result).toBeNull();
  });

  it('should not delete a genre when it does not exist', async () => {
    const genre_id = new Uuid().toString();

    const mockDeleteUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(Promise.reject(new NotFoundError(genre_id, Genre))),
    };

    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;

    await expect(controller.delete(genre_id)).rejects.toThrow(
      new NotFoundError(genre_id, Genre),
    );
  });

  it('should update a genre', async () => {
    const genre_id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GenreOutput = {
      genre_id,
      name: 'Movie',
      categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
      categories: [
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Action',
          created_at: new Date(),
        },
      ],
      is_active: true,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateGenreDto = {
      name: 'Movie',
      categories_id: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
      is_active: true,
    };
    const presenter = await controller.update(genre_id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      genre_id,
      ...input,
    });

    console.log('Presenter returned from update:', presenter);

    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should not update a genre when it does not exist', async () => {
    const genre_id = new Uuid().toString();

    const mockUpdateUseCase = {
      execute: jest
        .fn()
        .mockReturnValue(Promise.reject(new NotFoundError(genre_id, Genre))),
    };

    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;

    await expect(
      controller.update(genre_id, { name: 'Updated Movie' }),
    ).rejects.toThrow(new NotFoundError(genre_id, Genre));
  });
});
