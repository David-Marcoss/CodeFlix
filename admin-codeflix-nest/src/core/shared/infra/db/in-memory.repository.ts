// Repositorios usados para testes unitarios

import {
  SearchParams,
  SortDirection,
} from '../../../shared/domain/repository/search-params';
import { SearchResult } from '../../../shared/domain/repository/search-result';
import { Entity } from '../../domain/entity';
import { NotFoundError } from '../../domain/errors/notFoundError';
import {
  IRepository,
  ISearchableRepository,
} from '../../domain/repository/repository-interface';
import { ValueObject } from '../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId> {
  items: E[] = [];

  async create(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async createMany(entity: E[]): Promise<void> {
    this.items.push(...entity);
  }

  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((i) =>
      i.entity_id.equals(entity.entity_id),
    );

    if (index === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }

    this.items[index] = entity;
  }

  async delete(entity_id: EntityId): Promise<void> {
    const index = this.items.findIndex((i) => i.entity_id.equals(entity_id));

    if (index === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(index, 1);
  }

  async getById(entity_id: EntityId): Promise<E> {
    const index = this.items.findIndex((i) => i.entity_id.equals(entity_id));

    if (index === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    return this.items[index];
  }

  async getAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
>
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields!: string[];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const sortItems = await this.applyFilter(this.items, props.filter ?? null);
    const orderItems = this.applySort(sortItems, props.sort, props.sort_dir);
    const applyPaginationItems = this.applyPaginate(
      orderItems,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      items: applyPaginationItems,
      current_page: props.page,
      per_page: props.per_page,
      total: this.items.length,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ): E[] {
    const start = (page - 1) * per_page;
    const end = start + per_page;

    return items.slice(start, end);
  }
}
