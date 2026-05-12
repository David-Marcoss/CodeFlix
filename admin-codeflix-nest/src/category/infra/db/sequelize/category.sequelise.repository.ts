import { Category } from "../../../../category/domain/category.entity";

import { ISearchableRepository } from "../../../../shared/domain/repository/repository-interface";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Entity } from "../../../../shared/domain/entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { CategoryModel } from "./category.model";
import { NotFoundError } from "../../../../shared/domain/errors/notFoundError";
import {
  CategorySearchParams,
  CategorySearchResult,
} from "src/category/domain/category.repository";
import { Op } from "sequelize";

export class CategoryRepository implements ISearchableRepository<
  Category,
  Uuid
> {
  sortableFields: string[];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const { page, per_page, sort, sort_dir, filter } = props;
    const offseat = (page - 1) * per_page;
    const limit = offseat + per_page;

    const { rows, count } = await this.categoryModel.findAndCountAll({
      where: filter
        ? {
            name: {
              [Op.like]: `%${filter}%`,
            },
          }
        : undefined,
      order: sort ? [[sort, sort_dir]] : [["created_at", "DESC"]],
      offset: offseat,
      limit,
    });

    return new SearchResult({
      items: rows.map(
        (model) =>
          new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
          }),
      ),
      total: count,
      current_page: page,
      per_page,
    });
  }

  async create(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  async createMany(entity: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entity.map((e) => ({
        category_id: e.category_id.id,
        name: e.name,
        description: e.description,
        is_active: e.is_active,
        created_at: e.created_at,
      })),
    );
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Category);
    }

    await this.categoryModel.update(
      {
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      },
      {
        where: { category_id: entity.category_id.id },
      },
    );
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Category);
    }

    await this.categoryModel.destroy({
      where: { category_id: entity_id.id },
    });
  }

  async getById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);

    if (model) {
      const newCategory = new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at,
      });

      return newCategory;
    }

    return null;
  }

  private async _get(category_id: string): Promise<CategoryModel> {
    return await this.categoryModel.findByPk(category_id);
  }

  async getAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map(
      (model) =>
        new Category({
          category_id: new Uuid(model.category_id),
          name: model.name,
          description: model.description,
          is_active: model.is_active,
          created_at: model.created_at,
        }),
    );
  }

  getEntity(): new (...args: any[]) => Category {
    throw new Error("Method not implemented.");
  }
}
