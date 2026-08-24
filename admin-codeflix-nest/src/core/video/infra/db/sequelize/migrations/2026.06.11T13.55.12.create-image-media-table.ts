import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable('image_medias', {
    image_media_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_media_related_field: {
      type: DataTypes.ENUM('banner', 'thumbnail', 'thumbnail_HALF'),
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
  });

  await queryInterface.addIndex(
    'image_medias',
    ['video_id', 'image_media_related_field'],
    {
      name: 'image_medias_video_id_image_media_related_field_unique',
      unique: true,
    },
  );
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('image_medias');
};
