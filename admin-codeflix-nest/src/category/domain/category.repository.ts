import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";
import { IRepository } from "../../shared/domain/repository/repository-interface";

export interface CategoryRepository extends IRepository<Category, Uuid> {}
