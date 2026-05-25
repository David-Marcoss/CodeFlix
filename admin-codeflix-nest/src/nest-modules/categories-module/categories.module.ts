import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoriesController } from './categories.controller';
import { CategoryModel } from '../../core/category/infra/db/sequelize/category.model';
import { CATEGORY_PROVIDERS } from './categories.provider';

@Module({
  controllers: [CategoriesController],
  imports: [SequelizeModule.forFeature([CategoryModel])],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
