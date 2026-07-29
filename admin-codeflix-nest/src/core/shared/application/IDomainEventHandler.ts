import { IDomainEvent } from '../domain/events/domain-events.interface';

export interface IDomainEventHandler {
  handle(domainEvent: IDomainEvent): Promise<void>;
}
