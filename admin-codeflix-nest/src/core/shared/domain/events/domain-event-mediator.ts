import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '../aggregate-root';

export class DomainEventMediator {
  constructor(private eventEmiter: EventEmitter2) {}

  register(event: string, handler: any) {
    this.eventEmiter.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.getUncommittedEvents()) {
      const eventName = event.constructor.name;
      aggregateRoot.markEventDispached(event);
      await this.eventEmiter.emitAsync(eventName, event);
    }
  }

  async publishIntegrationEvents(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const integrationEvent = event.getIntegrationEvent?.();
      if (!integrationEvent) continue;
      await this.eventEmiter.emitAsync(
        integrationEvent.constructor.name,
        integrationEvent,
      );
    }
  }
}
