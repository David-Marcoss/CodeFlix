import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  create(entity: E): Promise<void>;
  createMany(entity: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId): Promise<void>;

  getById(entity_id: EntityId): Promise<E | null>;
  getAll(): Promise<E[]>;
  getEntity(): new (...args: any[]) => E;
  findByIds(ids: EntityId[]): Promise<E[]>;
  existsById(ids: EntityId[]): Promise<{
    exists: EntityId[];
    not_exists: EntityId[];
  }>;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
