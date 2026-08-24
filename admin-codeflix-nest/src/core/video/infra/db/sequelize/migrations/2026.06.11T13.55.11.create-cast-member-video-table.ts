import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('cast_member_video', {
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
    cast_member_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'cast_members',
        key: 'cast_member_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('cast_member_video');
};
