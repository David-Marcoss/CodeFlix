import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('genre_video', {
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
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'genres',
        key: 'genre_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('genre_video');
};
