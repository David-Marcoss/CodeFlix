import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMenssageBroker } from '../../application/menssage-broker.interface';
import { IDomainEvent } from '../../domain/events/domain-events.interface';
import { EVENT_MENSSAGE_BROKER_CONFIG } from './events-menssage-broker-config';

export class RabbitMqMessageBroker implements IMenssageBroker {
  constructor(private con: AmqpConnection) {}

  async publishEvent(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const { exchange, routing_key: routingKey } =
      EVENT_MENSSAGE_BROKER_CONFIG[eventName];

    const message = {
      event_name: eventName,
      event_version: event.event_version,
      occurred_on: event.occurred_on,
      payload: event['payload'],
    };

    await this.con.publish(exchange, routingKey, message);
  }
}
