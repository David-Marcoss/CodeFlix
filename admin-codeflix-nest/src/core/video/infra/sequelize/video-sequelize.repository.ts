import { Op, QueryTypes } from 'sequelize';
import { NotFoundError } from '../../../shared/domain/errors/notFoundError';
import { UnitOfWorkSequelize } from '../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Video, VideoId } from '../../domain/video.aggregate';
import {
  IVideoRepository,
  VideoSearchParams,
  VideoSearchResult,
} from '../../domain/video.repository';
import { VideoModel } from './video-model';
import { VideoModelMapper } from './video-model-mapper';
import { SortDirection } from '../../../shared/domain/repository/search-params';
import { InvalidArgumentError } from '../../../shared/domain/errors/invalid-argument-error';

export class VideoSequelizeRepository implements IVideoRepository {
  sortableFields: string[] = ['title', 'created_at'];
  relations_include = [
    'categories_id',
    'cast_members_id',
    'genres_id',
    'image_medias',
    'audio_video_medias',
  ];

  constructor(
    private videoModel: typeof VideoModel,
    private unitOfWork?: UnitOfWorkSequelize,
  ) {}

  async create(entity: Video): Promise<void> {
    const data = VideoModelMapper.toModelProps(entity);

    await this.videoModel.create(data, {
      include: this.relations_include,
      transaction: this.unitOfWork?.getTransaction(),
    });
  }

  async createMany(entity: Video[]): Promise<void> {
    await this.videoModel.bulkCreate(
      entity.map((e) => VideoModelMapper.toModelProps(e)),
      {
        include: [
          'categories_id',
          'cast_members_id',
          'genres_id',
          'image_medias',
          'audio_video_medias',
        ],
        transaction: this.unitOfWork?.getTransaction(),
      },
    );
  }

  async update(entity: Video): Promise<void> {
    const id = entity.video_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Video);
    }

    const data = VideoModelMapper.toModelProps(entity);

    // limpa os relacionamentos
    await Promise.all([
      ...model.image_medias.map((i) =>
        i.destroy({ transaction: this.unitOfWork?.getTransaction() }),
      ),
      ...model.audio_video_medias.map((i) =>
        i.destroy({
          transaction: this.unitOfWork?.getTransaction(),
        }),
      ),
      model.$remove(
        'categories',
        model.categories_id.map((item) => item.category_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),

      model.$remove(
        'genres',
        model.genres_id.map((item) => item.genre_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),

      model.$remove(
        'cast_members',
        model.cast_members_id.map((item) => item.cast_member_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),
    ]);

    const {
      categories_id,
      cast_members_id,
      genres_id,
      audio_video_medias,
      image_medias,
      ...updateData
    } = data;

    await this.videoModel.update(updateData, {
      where: { video_id: entity.video_id.id },
      transaction: this.unitOfWork?.getTransaction(),
    });

    // cria novos
    await Promise.all([
      ...image_medias.map((i) =>
        model.$create('image_media', i.toJSON(), {
          transaction: this.unitOfWork?.getTransaction(),
        }),
      ),
      ...audio_video_medias.map((i) =>
        model.$create('audio_video_media', i.toJSON(), {
          transaction: this.unitOfWork?.getTransaction(),
        }),
      ),
      model.$add(
        'categories',
        categories_id?.map((item) => item.category_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),

      model.$add(
        'genres',
        genres_id?.map((item) => item.genre_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),

      model.$add(
        'cast_members',
        cast_members_id?.map((item) => item.cast_member_id),
        {
          transaction: this.unitOfWork?.getTransaction(),
        },
      ),
    ]);
  }

  async delete(entity_id: VideoId): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, Video);
    }

    // obtem o model associado ao Video
    const videoCategoryModel =
      this.videoModel.associations.categories_id.target;

    // remove todos items associados ao video
    await videoCategoryModel.destroy({
      where: { video_id: entity_id.id },
      transaction: this.unitOfWork?.getTransaction(),
    });

    await this.videoModel.destroy({
      where: { video_id: entity_id.id },
      transaction: this.unitOfWork?.getTransaction(),
    });
  }

  async getById(entity_id: VideoId): Promise<Video | null> {
    const model = await this._get(entity_id.id);

    return model ? VideoModelMapper.toEntity(model) : null;
  }

  private async _get(video_id: string): Promise<VideoModel | null> {
    return await this.videoModel.findByPk(video_id, {
      include: this.relations_include,
      transaction: this.unitOfWork?.getTransaction(),
    });
  }

  async findByIds(ids: VideoId[]): Promise<Video[]> {
    const models = await this.videoModel.findAll({
      where: {
        video_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      include: this.relations_include,
      transaction: this.unitOfWork?.getTransaction(),
    });
    return models.map((m) => VideoModelMapper.toEntity(m));
  }

  async existsById(
    ids: VideoId[],
  ): Promise<{ exists: VideoId[]; not_exists: VideoId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsVideoModels = await this.videoModel.findAll({
      attributes: ['video_id'],
      where: {
        video_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      transaction: this.unitOfWork?.getTransaction(),
    });
    const existsVideoIds = existsVideoModels.map(
      (m) => new VideoId(m.video_id),
    );
    const notExistsVideoIds = ids.filter(
      (id) => !existsVideoIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsVideoIds,
      not_exists: notExistsVideoIds,
    };
  }

  async getAll(): Promise<Video[]> {
    const models = await this.videoModel.findAll({
      include: this.relations_include,
      transaction: this.unitOfWork?.getTransaction(),
    });

    return models.map((model) => VideoModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Video {
    throw new Error('Method not implemented.');
  }

  async search(props: VideoSearchParams): Promise<VideoSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const videoCategoryRelation =
      this.videoModel.associations.categories_id.target;
    const videoTableName = this.videoModel.getTableName() as string;
    const videoCategoryTableName =
      videoCategoryRelation.getTableName() as string;
    const videoAlias = this.videoModel.name;

    const wheres: any[] = [];

    if (props.filter && (props.filter.title || props.filter.categories_id)) {
      if (props.filter.title) {
        wheres.push({
          field: 'title',
          value: `%${props.filter.title}%`,
          get condition() {
            return {
              [this.field]: {
                [Op.like]: this.value,
              },
            };
          },
          rawCondition: `${videoAlias}.title LIKE :title`,
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
          rawCondition: `${videoCategoryTableName}.category_id IN (:categories_id)`,
        });
      }

      if (props.filter?.cast_members_id) {
        wheres.push({
          field: '?.cast_members_id',
          value: props.filter?.cast_members_id.map((c) => c.id),
          get condition() {
            return {
              ['$?.cast_members_id.category_id$']: {
                [Op.in]: this.value,
              },
            };
          },
          rawCondition: `${videoCategoryTableName}.category_id IN (:?.cast_members_id)`,
        });
      }

      if (props.filter?.genres_id) {
        wheres.push({
          field: '?.genres_id',
          value: props.filter?.genres_id.map((c) => c.id),
          get condition() {
            return {
              ['$?.genres_id.category_id$']: {
                [Op.in]: this.value,
              },
            };
          },
          rawCondition: `${videoCategoryTableName}.category_id IN (:?.genres_id)`,
        });
      }
    }

    const orderBy = this.formatSort(props.sort, props.sort_dir, videoAlias);
    const join = props.filter?.categories_id
      ? `INNER JOIN ${videoCategoryTableName} ON ${videoAlias}.\`video_id\` = ${videoCategoryTableName}.\`video_id\``
      : '';
    const where = wheres.length
      ? `WHERE ${wheres.map((w) => w.rawCondition).join(' AND ')}`
      : '';
    const replacements = wheres.reduce(
      (acc, w) => ({ ...acc, [w.field]: w.value }),
      {},
    );

    const [countResult] = await this.videoModel.sequelize!.query<{
      total: number;
    }>(
      [
        `SELECT COUNT(DISTINCT ${videoAlias}.\`video_id\`) as total`,
        `FROM ${videoTableName} as ${videoAlias}`,
        join,
        where,
      ].join(' '),
      {
        replacements,
        transaction: this.unitOfWork?.getTransaction(),
        type: QueryTypes.SELECT,
      },
    );

    const idsResult = await this.videoModel.sequelize!.query<{
      video_id: string;
    }>(
      [
        'SELECT',
        `DISTINCT ${videoAlias}.\`video_id\`, ${orderBy.column} as order_column`,
        `FROM ${videoTableName} as ${videoAlias}`,
        join,
        where,
        `ORDER BY ${orderBy.expression}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ].join(' '),
      {
        replacements,
        transaction: this.unitOfWork?.getTransaction(),
        type: QueryTypes.SELECT,
      },
    );
    const ids = idsResult.map((item) => item.video_id);

    const models = ids.length
      ? await this.videoModel.findAll({
          where: {
            video_id: {
              [Op.in]: ids,
            },
          },
          include: this.relations_include,
          transaction: this.unitOfWork?.getTransaction(),
        })
      : [];
    const modelsMap = new Map(models.map((model) => [model.video_id, model]));
    const sortedModels = ids
      .map((id) => modelsMap.get(id))
      .filter((model): model is VideoModel => !!model);

    return new VideoSearchResult({
      items: sortedModels.map((m) => VideoModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      total: Number(countResult?.total ?? 0),
    });
  }

  private formatSort(
    sort: string | null,
    sort_dir: SortDirection | null,
    videoAlias: string,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return {
        column: `${videoAlias}.\`created_at\``,
        expression: `${videoAlias}.\`created_at\` DESC`,
      };
    }

    const direction = sort_dir === 'desc' ? 'DESC' : 'ASC';
    const column = `${videoAlias}.\`${sort}\``;

    if (sort === 'title') {
      const dialect = this.videoModel.sequelize!.getDialect();

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
