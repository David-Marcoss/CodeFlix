import { DataTypes, Sequelize } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  for (const table of ['image_medias', 'audio_video_medias']) {
    await context.getQueryInterface().addColumn(table, 'url', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
};

export const down: MigrationFn<Sequelize> = async ({ context }) => {
  for (const table of ['audio_video_medias', 'image_medias']) {
    await context.getQueryInterface().removeColumn(table, 'url');
  }
};
