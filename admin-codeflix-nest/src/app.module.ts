import { Module } from '@nestjs/common';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members-module.module';
import { GenresModule } from './nest-modules/genre-module/genre.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
    CastMembersModule,
    GenresModule,
  ],
})
export class AppModule {}
