import { ChannelWrapper } from 'amqp-connection-manager';
import { IIntegrationEvent } from '../../../domain/events/domain-events.interface';
import { RabbitMqMessageBroker } from '../rabbitmqt-menssage-broker';
import { EVENT_MENSSAGE_BROKER_CONFIG } from '../events-menssage-broker-config';
import { Uuid } from '../../../domain/value-objects/uuid.vo';

class TestEvent implements IIntegrationEvent {
  event_name = TestEvent.name;
  occurred_on: Date = new Date();
  event_version: number = 1;
  constructor(readonly payload: any) {}
}

describe('RabbitMenssageBroker Unit tests', () => {
  let service: RabbitMqMessageBroker;
  let connection: ChannelWrapper;
  let publishMock: jest.Mock;
  beforeEach(async () => {
    publishMock = jest.fn();
    connection = {
      publish: publishMock,
    } as any;
    service = new RabbitMqMessageBroker(connection as any);
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);

      expect(publishMock).toHaveBeenCalledWith(
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

    it('should reject an event without broker configuration', async () => {
      const event = new TestEvent(new Uuid());
      event.event_name = 'UnknownEvent';

      await expect(service.publishEvent(event)).rejects.toThrow(
        'Message broker config not found for event UnknownEvent',
      );
      expect(publishMock).not.toHaveBeenCalled();
    });

    it('should reject an undefined event', async () => {
      await expect(
        service.publishEvent(undefined as unknown as IIntegrationEvent),
      ).rejects.toThrow('Integration event is required');
      expect(publishMock).not.toHaveBeenCalled();
    });
  });
});
