import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMenssageBroker } from '../../application/menssage-broker.interface';
import { IIntegrationEvent } from '../../domain/events/domain-events.interface';
import { EVENT_MENSSAGE_BROKER_CONFIG } from './events-menssage-broker-config';

export class RabbitMqMessageBroker implements IMenssageBroker {
  constructor(private con: AmqpConnection) {}

  async publishEvent(event: IIntegrationEvent): Promise<void> {
    if (!event) {
      throw new Error('Integration event is required');
    }

    const eventName = event.event_name;
    const eventConfig = EVENT_MENSSAGE_BROKER_CONFIG[eventName];

    if (!eventConfig) {
      throw new Error(`Message broker config not found for event ${eventName}`);
    }

    const { exchange, routing_key: routingKey } = eventConfig;

    // const message = {
    //   event_name: eventName,
    //   event_version: event.event_version,
    //   occurred_on: event.occurred_on,
    //   payload: event.payload,
    // };

    await this.con.publish(exchange, routingKey, event);
  }
}
