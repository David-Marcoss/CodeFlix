import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('genre_category', {
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
  await sequelize.getQueryInterface().dropTable('genre_category');
};
