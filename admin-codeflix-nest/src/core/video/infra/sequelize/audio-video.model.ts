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
import { AudioVideoMediaStatus } from '../../../shared/domain/value-objects/audio-video-media.vo';

export enum AudioVideoRelatedField {
  TRAILER = 'trailer',
  VIDEO = 'video',
}

export interface AudioVideoMediaModelProps {
  audio_video_media_id: string;
  name: string;
  raw_location: string;
  encoded_location: string | null;
  video_id: string;
  audio_video_related_field: AudioVideoRelatedField;
  status: AudioVideoMediaStatus;
}

@Table({
  tableName: 'audio_video_medias',
  timestamps: false,
  indexes: [
    { fields: ['video_id', 'audio_video_related_field'], unique: true },
  ],
})
export class AudioVideoMediaModel extends Model<AudioVideoMediaModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => new Uuid().id })
  declare audio_video_media_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare raw_location: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  declare encoded_location: string | null;

  @Column({
    allowNull: false,
    type: DataType.ENUM(
      AudioVideoMediaStatus.PENDING,
      AudioVideoMediaStatus.PROCESSING,
      AudioVideoMediaStatus.COMPLETED,
      AudioVideoMediaStatus.FAILED,
    ),
  })
  declare status: AudioVideoMediaStatus;

  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ allowNull: false, type: DataType.UUID })
  declare video_id: string;

  @Column({ allowNull: false, type: DataType.STRING(20) })
  declare audio_video_related_field: AudioVideoRelatedField;
}
