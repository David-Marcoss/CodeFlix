import { Genre } from '../../../domain/genre.aggregate';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory.repository';
import {
  GenreFilter,
  IGenreRepository,
} from '../../../domain/genre.repository';

export class GenreInMemoryRepository
  extends InMemorySearchableRepository<Genre, Uuid, GenreFilter>
  implements IGenreRepository
{
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: Genre[],
    filter: GenreFilter | null,
  ): Promise<Genre[]> {
    if (!filter) {
      return items;
    }

    const { categories_id, name } = filter;

    return items.filter((i) => {
      const hasName = name && i.name.toLowerCase().includes(name.toLowerCase());
      const hasCategoryId =
        categories_id?.length &&
        categories_id.some((id) => i.categories_id.has(id.id));

      return hasName && hasCategoryId ? true : hasName ? true : hasCategoryId;
    });
  }

  protected applySort(
    items: Genre[],
    sort: string | null,
    sort_dir: 'asc' | 'desc' | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => Genre {
    return Genre;
  }
}
