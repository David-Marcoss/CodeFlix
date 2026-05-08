import { Category } from "../../../category/domain/category.entity";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../shared/infra/db/in-memory.repository";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid
> {
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: string | null,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.created_at.toString() === filter
      );
    });
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: "asc" | "desc" | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "created_at", "desc");
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
