import { CastMember } from '../../../domain/cast-member.aggregate';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory.repository';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, Uuid>
  implements ICastMemberRepository
{
  sortableFields: string[] = ['name', 'type', 'created_at'];

  protected async applyFilter(
    items: CastMember[],
    filter: string | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.type.toString().toLowerCase().includes(filter.toLowerCase()) ||
        i.created_at.toString() === filter
      );
    });
  }

  protected applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: 'asc' | 'desc' | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
