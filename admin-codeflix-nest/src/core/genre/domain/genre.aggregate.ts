import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { ValueObject } from '../../shared/domain/value-object';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { CategoryId } from '../../category/domain/category.aggregate';
import { GenreFakeBuilder } from './genre-fake.builder';
import { GenreValidatorFactory } from './genre.validator';

export class GenreId extends Uuid {}

export type CreateGenreProps = {
  genre_id?: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type CreateGenreComand = {
  name: string;
  categories_id: GenreId[];
  is_active?: boolean;
};

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active: boolean;
  created_at: Date;

  constructor(props: CreateGenreProps) {
    super();
    this.genre_id = props.genre_id || new GenreId();
    this.name = props.name;
    this.is_active = props.is_active ?? true;
    this.categories_id = props.categories_id;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CreateGenreComand) {
    const instance = new Genre({
      ...props,
      categories_id: new Map(
        props.categories_id.map((item) => [item.id, item]),
      ),
    });
    instance.validate();

    return instance;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  addCategoryId(category_id: CategoryId) {
    this.categories_id.set(category_id.id, category_id);
  }

  deleteCategoryId(category_id: CategoryId) {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(catefories_id: CategoryId[]) {
    if (catefories_id.length === 0) {
      return;
    }

    this.categories_id = new Map(catefories_id.map((item) => [item.id, item]));
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      genre_id: this.genre_id.id,
      name: this.name,
      categories_id: Array.from(this.categories_id.values()).map(
        (category_id) => category_id.id,
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }

  static fake() {
    return GenreFakeBuilder;
  }

  get entity_id(): ValueObject {
    return this.genre_id;
  }
}
