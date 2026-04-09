import {
  IsBoolean,
  IsNotEmpty,
  isNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

class CategoryRules {
  @IsOptional()
  @IsObject()
  category_id?: Uuid;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  is_active: boolean;

  constructor({ name, description, category_id, is_active }: Category) {
    Object.assign(this, { name, description, category_id, is_active });
  }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity: Category): boolean {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
