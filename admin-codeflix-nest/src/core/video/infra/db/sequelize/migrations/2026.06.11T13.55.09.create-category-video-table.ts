import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('category_video', {
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
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'category_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('category_video');
};
