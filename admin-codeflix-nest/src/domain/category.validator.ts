import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "./shared/domain/validators/class-validator-fields";

class CategoryRules {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsString()
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
