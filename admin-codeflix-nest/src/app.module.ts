import { Module } from '@nestjs/common';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members-module.module';
import { GenresModule } from './nest-modules/genre-module/genre.module';
import { VideosModule } from './nest-modules/video-module/video.module';
import { UsecaseModule } from './nest-modules/usecase-module/usecase.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { RabbitMQFakeConsumer } from '../fake-rabitmqt.consumer';
import { RabbitmqModule } from './nest-modules/rabbitmq-module/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
    EventModule,
    UsecaseModule,
    RabbitmqModule.forRoot(),
    CategoriesModule,
    CastMembersModule,
    GenresModule,
    VideosModule,
  ],
  providers: [RabbitMQFakeConsumer],
})
export class AppModule {}
