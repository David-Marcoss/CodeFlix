import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable('audio_video_medias', {
    audio_video_media_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    raw_location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    encoded_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
    },
    video_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'videos',
        key: 'video_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    audio_video_related_field: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });

  await queryInterface.addIndex(
    'audio_video_medias',
    ['video_id', 'audio_video_related_field'],
    {
      name: 'audio_video_medias_video_id_audio_video_related_field_unique',
      unique: true,
    },
  );
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('audio_video_medias');
};
