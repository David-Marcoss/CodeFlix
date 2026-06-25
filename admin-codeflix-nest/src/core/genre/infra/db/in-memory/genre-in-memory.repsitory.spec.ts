import { CategoryId } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../domain/genre.aggregate';
import { GenreInMemoryRepository } from './genre-in-memory.repsitory';

describe('GenreInMemoryRepository', () => {
  let repository: GenreInMemoryRepository;

  beforeEach(() => (repository = new GenreInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [Genre.fake().aGenre().withName('test').build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      Genre.fake().aGenre().withName('test').build(),
      Genre.fake().aGenre().withName('TEST').build(),
      Genre.fake().aGenre().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'TEST',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = [
      Genre.fake().aGenre().withName('test').withCreatedAt(created_at).build(),
      Genre.fake()
        .aGenre()
        .withName('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Genre.fake()
        .aGenre()
        .withName('fake')
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      Genre.create({ name: 'c', categories_id: [] }),
      Genre.create({ name: 'b', categories_id: [] }),
      Genre.create({ name: 'a', categories_id: [] }),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });

  it('should filter by categories_id', async () => {
    const categoryId = new CategoryId();

    const items = [
      Genre.fake()
        .aGenre()
        .withName('test 1')
        .addCategoryId(categoryId)
        .build(),
      Genre.fake()
        .aGenre()
        .withName('TEST 2')
        .addCategoryId(new CategoryId())
        .build(),
      Genre.fake()
        .aGenre()
        .withName('fake 3')
        .addCategoryId(new CategoryId())
        .build(),
    ];

    const itemsSorted = await repository['applyFilter'](items, {
      categories_id: [categoryId],
    });

    expect(itemsSorted).toStrictEqual([items[0]]);

    expect(itemsSorted[0]).toStrictEqual(items[0]);
  });

  it('should filter by categories_id and name', async () => {
    const categoryId = new CategoryId();

    const items = [
      Genre.fake()
        .aGenre()
        .withName('test 1')
        .addCategoryId(categoryId)
        .build(),
      Genre.fake()
        .aGenre()
        .withName('TEST 2')
        .addCategoryId(new CategoryId())
        .build(),
      Genre.fake()
        .aGenre()
        .withName('fake 3')
        .addCategoryId(new CategoryId())
        .build(),
    ];

    const itemsSorted = await repository['applyFilter'](items, {
      name: 'TEST 1',
      categories_id: [categoryId],
    });

    expect(itemsSorted).toStrictEqual([items[0]]);

    expect(itemsSorted[0]).toStrictEqual(items[0]);
  });
});
