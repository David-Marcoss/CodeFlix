import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';

import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { SearchResult } from '../../../../shared/domain/repository/search-result';
import { CastMemberModel } from './cast-member.model';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '../../../domain/cast-member.repository';
import { literal, Op, Order } from 'sequelize';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { CastMemberModelMapper } from './cast-member-model-mapper';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument-error';

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = [];

  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async findByIds(ids: CastMemberId[]): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll({
      where: {
        cast_member_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    return models.map((m) => CastMemberModelMapper.toEntity(m));
  }

  async existsById(
    ids: CastMemberId[],
  ): Promise<{ exists: CastMemberId[]; not_exists: CastMemberId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsCastMemberModels = await this.castMemberModel.findAll({
      attributes: ['cast_member_id'],
      where: {
        cast_member_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    const existsCastMemberIds = existsCastMemberModels.map(
      (m) => new CastMemberId(m.cast_member_id),
    );
    const notExistsCastMemberIds = ids.filter(
      (id) => !existsCastMemberIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsCastMemberIds,
      not_exists: notExistsCastMemberIds,
    };
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    const { page, per_page, sort, sort_dir, filter } = props;
    const offseat = (page - 1) * per_page;
    const limit = per_page;
    const order: Order =
      sort && sort_dir
        ? this.formatSort(sort, sort_dir)
        : [['created_at', 'DESC']];

    const { rows, count } = await this.castMemberModel.findAndCountAll({
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
      items: rows.map((model) => CastMemberModelMapper.toEntity(model)),
      total: count,
      current_page: page,
      per_page,
    });
  }

  async create(entity: CastMember): Promise<void> {
    const data = CastMemberModelMapper.toModel(entity).toJSON();

    await this.castMemberModel.create(data);
  }

  async createMany(entity: CastMember[]): Promise<void> {
    await this.castMemberModel.bulkCreate(
      entity.map((e) => CastMemberModelMapper.toModel(e).toJSON()),
    );
  }

  async update(entity: CastMember): Promise<void> {
    const id = entity.cast_member_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, CastMember);
    }

    const data = CastMemberModelMapper.toModel(entity).toJSON();

    await this.castMemberModel.update(data, {
      where: { cast_member_id: entity.cast_member_id.id },
    });
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, CastMember);
    }

    await this.castMemberModel.destroy({
      where: { cast_member_id: entity_id.id },
    });
  }

  async getById(entity_id: Uuid): Promise<CastMember | null> {
    const model = await this._get(entity_id.id);

    return model ? CastMemberModelMapper.toEntity(model) : null;
  }

  private async _get(cast_member_id: string): Promise<CastMemberModel | null> {
    return await this.castMemberModel.findByPk(cast_member_id);
  }

  async getAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();

    return models.map((model) => CastMemberModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => CastMember {
    throw new Error('Method not implemented.');
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }
}
