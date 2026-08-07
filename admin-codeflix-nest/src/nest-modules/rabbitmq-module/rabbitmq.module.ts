import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMqMessageBroker } from '../../core/shared/infra/menssage-broker/rabbitmqt-menssage-broker';
import { RabbitmqConsumeErrorFilter } from './rabbitmq-consumer-error/rabbitmq-consumer-error.filter';

interface RabbitmqModuleOptions {
  enableConsumers?: boolean;
}

@Module({})
export class RabbitmqModule {
  // adciona configuração dinamica para o modulo, para que seja possivel configurar a conexão do rabbit no modulo principal,
  // e acessar o Menssage broker em qualquer outro modulo sem que precise iniciar uma nova conexão

  static forRoot(options?: RabbitmqModuleOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      global: true,
      imports: [
        RabbitMQModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            uri: configService.getOrThrow<string>('RABBITMQ_URI'),
            connectionInitOptions: { wait: false },
            registerHandlers:
              options?.enableConsumers ??
              configService.getOrThrow<boolean>('RABBITMQ_REGISTER_HANDLER'),
            enableControllerDiscovery: true,
            enableHealthCheck: true,
            exchanges: [
              // exchange zona morta, para onde as mensagens que não puderem ser processadas serão enviadas
              {
                name: 'dlx.exchange',
                type: 'topic',
              },
              {
                name: 'direct.delayed',
                type: 'x-delayed-message',
                options: {
                  arguments: {
                    'x-delayed-type': 'direct',
                  },
                },
              },
            ],
            queues: [
              {
                name: 'dlx.queue',
                exchange: 'dlx.exchange',
                routingKey: '#', //aceito qualquer routing key
                createQueueIfNotExists: true,
              },
            ],
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [RabbitmqConsumeErrorFilter],
      exports: [RabbitMQModule],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: RabbitmqModule,
      providers: [
        {
          provide: 'IMenssageBroker',
          useFactory: (con: AmqpConnection) => {
            return new RabbitMqMessageBroker(con);
          },
          inject: [AmqpConnection],
        },
      ],
      exports: ['IMenssageBroker'],
    };
  }
}
