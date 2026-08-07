import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Config } from '../../config';
import { ConsumeMessage } from 'amqplib';
import { IIntegrationEvent } from '../../../domain/events/domain-events.interface';
import { RabbitMqMessageBroker } from '../rabbitmqt-menssage-broker';

class TestEvent implements IIntegrationEvent {
  event_name = TestEvent.name;
  occurred_on: Date = new Date();
  event_version: number = 1;
  constructor(readonly payload: any) {}
}

describe('RabbitMQMessageBroker Integration tests', () => {
  let service: RabbitMqMessageBroker;
  let connection: AmqpConnection;
  let queueName: string;

  beforeEach(async () => {
    connection = new AmqpConnection({
      uri: Config.rabbitmqUri(),
      connectionInitOptions: { wait: true },
      logger: {
        debug: () => {},
        error: () => {},
        info: () => {},
        warn: () => {},
        log: () => {},
      } as any,
    });

    await connection.init();
    const channel = connection.channel;

    await channel.assertExchange('test-exchange', 'direct', {
      durable: false,
    });

    const queue = await channel.assertQueue('', {
      durable: false,
      exclusive: true,
      autoDelete: true,
    });
    queueName = queue.queue;

    await channel.bindQueue(queueName, 'test-exchange', 'TestEvent');
    service = new RabbitMqMessageBroker(connection);
  });

  afterEach(async () => {
    await connection.managedConnection.close();
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);
      const msg = await new Promise<ConsumeMessage>((resolve, reject) => {
        connection.channel.consume(queueName, (message) => {
          if (!message) {
            reject(new Error('RabbitMQ consumer was cancelled'));
            return;
          }

          resolve(message);
        });
      });
      const msgObj = JSON.parse(msg.content.toString());
      expect(msgObj).toEqual({
        event_name: TestEvent.name,
        event_version: 1,
        occurred_on: event.occurred_on.toISOString(),
        payload: event.payload,
      });
    });
  });
});
