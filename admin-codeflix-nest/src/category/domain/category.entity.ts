import { CategoryValidatorFactory } from "./category.validator";
import { EntityValidationError } from "../../shared/domain/validators/validation.error";

export type CreateCategoryProps = {
  category_id?: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export type CreateCategoryComand = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export class Category {
  category_id: string | undefined;
  name: string;
  description: string | undefined;
  is_active: boolean;
  created_at: Date;

  constructor(props: CreateCategoryProps) {
    this.category_id = props.category_id;
    this.name = props.name;
    this.description = props.description;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CreateCategoryComand) {
    const instance = new Category(props);
    Category.validate(instance);

    return instance;
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();

    const isValid = validator.validate(entity);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON() {
    return {
      category_id: this.category_id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
