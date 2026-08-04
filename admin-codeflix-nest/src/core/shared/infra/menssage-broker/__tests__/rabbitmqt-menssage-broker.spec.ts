import { ChannelWrapper } from 'amqp-connection-manager';
import { IDomainEvent } from '../../../domain/events/domain-events.interface';
import { RabbitMqMessageBroker } from '../rabbitmqt-menssage-broker';
import { EVENT_MENSSAGE_BROKER_CONFIG } from '../events-menssage-broker-config';
import { ValueObject } from '../../../domain/value-object';
import { Uuid } from '../../../domain/value-objects/uuid.vo';

class TestEvent implements IDomainEvent {
  occurred_on: Date = new Date();
  event_version: number = 1;
  aggregate_id: ValueObject = new Uuid();
  constructor(readonly payload: any) {}
}

describe('RabbitMenssageBroker Unit tests', () => {
  let service: RabbitMqMessageBroker;
  let connection: ChannelWrapper;
  beforeEach(async () => {
    connection = {
      publish: jest.fn(),
    } as any;
    service = new RabbitMqMessageBroker(connection as any);
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);

      expect(connection.publish).toHaveBeenCalledWith(
        EVENT_MENSSAGE_BROKER_CONFIG[TestEvent.name].exchange,
        EVENT_MENSSAGE_BROKER_CONFIG[TestEvent.name].routing_key,
        {
          event_name: TestEvent.name,
          event_version: event.event_version,
          occurred_on: event.occurred_on,
          payload: event.payload,
        },
      );
    });
  });
});
