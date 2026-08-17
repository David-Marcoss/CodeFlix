import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoriesController } from './categories.controller';
import { CategoryModel } from '../../core/category/infra/db/sequelize/category.model';
import { CATEGORY_PROVIDERS } from './categories.provider';
import { AuthModule } from '../auth-module/auth.module';

@Module({
  controllers: [CategoriesController],
  imports: [SequelizeModule.forFeature([CategoryModel]), AuthModule],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
  ],
  exports: [CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide],
})
export class CategoriesModule {}
