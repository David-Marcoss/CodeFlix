import { Genre, GenreId } from '../../../domain/genre.aggregate';

import { GenreModel } from './genre-model';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import {
  GenreSearchParams,
  GenreSearchResult,
  IGenreRepository,
} from '../../../domain/genre.repository';
import { Op, QueryTypes } from 'sequelize';
import { GenreModelMapper } from './genre-model-mapper';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { UnitOfWorkSequelize } from '../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument-error';

export class GenreSequelizeRepository implements IGenreRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(
    private genreModel: typeof GenreModel,
    private unitOfWork?: UnitOfWorkSequelize,
  ) {}

  async create(entity: Genre): Promise<void> {
    const data = GenreModelMapper.toModelProps(entity);

    await this.genreModel.create(data, {
      include: ['categories_id'],
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });
  }

  async createMany(entity: Genre[]): Promise<void> {
    await this.genreModel.bulkCreate(
      entity.map((e) => GenreModelMapper.toModelProps(e)),
      {
        include: ['categories_id'],
        transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
      },
    );
  }

  async update(entity: Genre): Promise<void> {
    const id = entity.genre_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Genre);
    }

    const data = GenreModelMapper.toModelProps(entity);

    // limpa os relacionamentos
    await model.$remove(
      'categories',
      model.categories_id.map((item) => item.category_id),
      {
        transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
      },
    );

    const { categories_id, ...updateData } = data;

    await this.genreModel.update(updateData, {
      where: { genre_id: entity.genre_id.id },
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });

    // adcionar os novos relacionamentos
    await model.$add(
      'categories',
      categories_id.map((item) => item.category_id),
      {
        transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
      },
    );
  }

  async delete(entity_id: GenreId): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Genre);
    }

    // obtem o model associado ao Genre
    const genreCategoryModel =
      this.genreModel.associations.categories_id.target;

    // remove todos items associados ao genre
    await genreCategoryModel.destroy({
      where: { genre_id: entity_id.id },
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });

    await this.genreModel.destroy({
      where: { genre_id: entity_id.id },
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });
  }

  async getById(entity_id: GenreId): Promise<Genre | null> {
    const model = await this._get(entity_id.id);

    return model ? GenreModelMapper.toEntity(model) : null;
  }

  private async _get(genre_id: string): Promise<GenreModel | null> {
    return await this.genreModel.findByPk(genre_id, {
      include: ['categories_id'],
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });
  }

  async getAll(): Promise<Genre[]> {
    const models = await this.genreModel.findAll({
      include: ['categories_id'],
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });

    return models.map((model) => GenreModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Genre {
    throw new Error('Method not implemented.');
  }

  async search(props: GenreSearchParams): Promise<GenreSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const genreCategoryRelation =
      this.genreModel.associations.categories_id.target;
    const genreTableName = this.genreModel.getTableName() as string;
    const genreCategoryTableName =
      genreCategoryRelation.getTableName() as string;
    const genreAlias = this.genreModel.name;

    const wheres: any[] = [];

    if (props.filter && (props.filter.name || props.filter.categories_id)) {
      if (props.filter.name) {
        wheres.push({
          field: 'name',
          value: `%${props.filter.name}%`,
          get condition() {
            return {
              [this.field]: {
                [Op.like]: this.value,
              },
            };
          },
          rawCondition: `${genreAlias}.name LIKE :name`,
        });
      }

      if (props.filter.categories_id) {
        wheres.push({
          field: 'categories_id',
          value: props.filter.categories_id.map((c) => c.id),
          get condition() {
            return {
              ['$categories_id.category_id$']: {
                [Op.in]: this.value,
              },
            };
          },
          rawCondition: `${genreCategoryTableName}.category_id IN (:categories_id)`,
        });
      }
    }

    const orderBy = this.formatSort(props.sort, props.sort_dir, genreAlias);
    const join = props.filter?.categories_id
      ? `INNER JOIN ${genreCategoryTableName} ON ${genreAlias}.\`genre_id\` = ${genreCategoryTableName}.\`genre_id\``
      : '';
    const where = wheres.length
      ? `WHERE ${wheres.map((w) => w.rawCondition).join(' AND ')}`
      : '';
    const replacements = wheres.reduce(
      (acc, w) => ({ ...acc, [w.field]: w.value }),
      {},
    );

    const [countResult] = await this.genreModel.sequelize!.query<{
      total: number;
    }>(
      [
        `SELECT COUNT(DISTINCT ${genreAlias}.\`genre_id\`) as total`,
        `FROM ${genreTableName} as ${genreAlias}`,
        join,
        where,
      ].join(' '),
      {
        replacements,
        transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
        type: QueryTypes.SELECT,
      },
    );

    const idsResult = await this.genreModel.sequelize!.query<{
      genre_id: string;
    }>(
      [
        'SELECT',
        `DISTINCT ${genreAlias}.\`genre_id\`, ${orderBy.column} as order_column`,
        `FROM ${genreTableName} as ${genreAlias}`,
        join,
        where,
        `ORDER BY ${orderBy.expression}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ].join(' '),
      {
        replacements,
        transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
        type: QueryTypes.SELECT,
      },
    );
    const ids = idsResult.map((item) => item.genre_id);

    const models = ids.length
      ? await this.genreModel.findAll({
          where: {
            genre_id: {
              [Op.in]: ids,
            },
          },
          include: ['categories_id'],
          transaction: this.unitOfWork
            ? this.unitOfWork.getTransaction()
            : null,
        })
      : [];
    const modelsMap = new Map(models.map((model) => [model.genre_id, model]));
    const sortedModels = ids
      .map((id) => modelsMap.get(id))
      .filter((model): model is GenreModel => !!model);

    return new GenreSearchResult({
      items: sortedModels.map((m) => GenreModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      total: Number(countResult?.total ?? 0),
    });
  }

  async findByIds(ids: GenreId[]): Promise<Genre[]> {
    const models = await this.genreModel.findAll({
      where: {
        genre_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      include: ['categories_id'],
      transaction: this.unitOfWork ? this.unitOfWork.getTransaction() : null,
    });
    return models.map((m) => GenreModelMapper.toEntity(m));
  }

  async existsById(
    ids: GenreId[],
  ): Promise<{ exists: GenreId[]; not_exists: GenreId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsGenreModels = await this.genreModel.findAll({
      attributes: ['genre_id'],
      where: {
        genre_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    const existsGenreIds = existsGenreModels.map(
      (m) => new GenreId(m.genre_id),
    );
    const notExistsGenreIds = ids.filter(
      (id) => !existsGenreIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsGenreIds,
      not_exists: notExistsGenreIds,
    };
  }

  private formatSort(
    sort: string | null,
    sort_dir: SortDirection | null,
    genreAlias: string,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return {
        column: `${genreAlias}.\`created_at\``,
        expression: `${genreAlias}.\`created_at\` DESC`,
      };
    }

    const direction = sort_dir === 'desc' ? 'DESC' : 'ASC';
    const column = `${genreAlias}.\`${sort}\``;

    if (sort === 'name') {
      const dialect = this.genreModel.sequelize!.getDialect();

      return {
        column,
        expression:
          dialect === 'mysql'
            ? `binary ${column} ${direction}`
            : `${column} COLLATE BINARY ${direction}`,
      };
    }

    return {
      column,
      expression: `${column} ${direction}`,
    };
  }
}
