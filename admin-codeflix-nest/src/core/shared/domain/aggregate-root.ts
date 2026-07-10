import EventEmitter2 from 'eventemitter2';
import { Entity } from './entity';
import { IDomainEvent } from './events/domain-events.interface';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set();
  localMediator = new EventEmitter2();

  // vai disparar o evento somente dentro do proprio aggregate root
  applyEvent(event: IDomainEvent): void {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  registerHandler(event: string, handler: (event: IDomainEvent) => void): void {
    this.localMediator.on(event, handler);
  }
}
