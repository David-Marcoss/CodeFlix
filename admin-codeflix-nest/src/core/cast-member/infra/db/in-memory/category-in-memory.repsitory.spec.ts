import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repsitory';

describe('CastMemberInMemoryRepository', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => (repository = new CastMemberInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [CastMember.fake().aCastMember().withName('test').build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('test').build(),
      CastMember.fake().aCastMember().withName('TEST').build(),
      CastMember.fake().aCastMember().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = [
      CastMember.fake()
        .aCastMember()
        .withName('test')
        .withCreatedAt(created_at)
        .build(),
      CastMember.fake()
        .aCastMember()
        .withName('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      CastMember.fake()
        .aCastMember()
        .withName('fake')
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const type = new CastMemberType('actor');
    const items = [
      new CastMember({ name: 'c', type }),
      new CastMember({ name: 'b', type }),
      new CastMember({ name: 'a', type }),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
