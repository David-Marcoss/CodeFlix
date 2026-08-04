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
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
    CastMembersModule,
    GenresModule,
    VideosModule,
    EventModule,
    UsecaseModule,
    RabbitMQModule.forRoot({
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [RabbitMQFakeConsumer],
})
export class AppModule {}
