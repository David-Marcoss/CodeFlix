import { Category } from '../../../domain/category.aggregate';

import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { SearchResult } from '../../../../shared/domain/repository/search-result';
import { CategoryModel } from './category.model';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository';
import { literal, Op, Order } from 'sequelize';
import { CategoryModelMapper } from './category-model-mapper';
import { SortDirection } from '../../../../shared/domain/repository/search-params';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = [];

  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const { page, per_page, sort, sort_dir, filter } = props;
    const offseat = (page - 1) * per_page;
    const limit = per_page;
    const order: Order =
      sort && sort_dir
        ? this.formatSort(sort, sort_dir)
        : [['created_at', 'DESC']];

    const { rows, count } = await this.categoryModel.findAndCountAll({
      where: filter
        ? {
            name: {
              [Op.like]: `%${filter}%`,
            },
          }
        : undefined,
      order,
      offset: offseat,
      limit,
    });

    return new SearchResult({
      items: rows.map((model) => CategoryModelMapper.toEntity(model)),
      total: count,
      current_page: page,
      per_page,
    });
  }

  async create(entity: Category): Promise<void> {
    const data = CategoryModelMapper.toModel(entity).toJSON();

    await this.categoryModel.create(data);
  }

  async createMany(entity: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entity.map((e) => CategoryModelMapper.toModel(e).toJSON()),
    );
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Category);
    }

    const data = CategoryModelMapper.toModel(entity).toJSON();

    await this.categoryModel.update(data, {
      where: { category_id: entity.category_id.id },
    });
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

    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  private async _get(category_id: string): Promise<CategoryModel | null> {
    return await this.categoryModel.findByPk(category_id);
  }

  async getAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Category {
    throw new Error('Method not implemented.');
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.categoryModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }
}
