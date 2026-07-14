import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { VideoModel } from './video-model';

export enum ImageMediaRelatedField {
  BANNER = 'banner',
  THUMBNAIL = 'thumbnail',
  THUMBNAIL_HALF = 'thumbnail_HALF',
}

export interface VideoModelProps {
  image_media_id: string;
  name: string;
  location: string;
  video_id: string;
  image_media_related_field: ImageMediaRelatedField;
}

@Table({
  tableName: 'image_medias',
  timestamps: false,
  indexes: [
    { fields: ['video_id', 'image_media_related_field'], unique: true },
  ],
})
export class ImageMediaModel extends Model<VideoModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => new Uuid().id })
  declare image_media_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING() })
  declare location: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(
      ImageMediaRelatedField.BANNER,
      ImageMediaRelatedField.THUMBNAIL,
      ImageMediaRelatedField.THUMBNAIL_HALF,
    ),
  })
  declare image_media_related_field: ImageMediaRelatedField;

  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ allowNull: false, type: DataType.UUID })
  declare video_id: string;
}
