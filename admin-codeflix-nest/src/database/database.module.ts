import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { CategoryModel } from '../core/category/infra/db/sequelize/category.model';
import { CONFIG_DB_SCHEMA_TYPES } from '../config/config.module';

const models = [CategoryModel];

export function getSequelizeOptions(
  configService: ConfigService<CONFIG_DB_SCHEMA_TYPES>,
): SequelizeModuleOptions {
  const dbVendor = configService.get('DB_VENDOR');

  if (dbVendor === 'sqlite') {
    return {
      dialect: dbVendor,
      host: configService.get('DB_HOST'),
      logging: configService.get('DB_LOGGING'),
      autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
      models,
    };
  }

  if (dbVendor === 'mysql') {
    return {
      dialect: dbVendor,
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      logging: configService.get('DB_LOGGING'),
      autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
      models,
    };
  }

  throw new Error(`Unsupported DB_VENDOR: ${dbVendor}`);
}

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: getSequelizeOptions,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
