import {
  IDomainEvent,
  IIntegrationEvent,
} from '../domain/events/domain-events.interface';

export interface IDomainEventHandler {
  handle(domainEvent: IDomainEvent): Promise<void>;
}

export interface IIntegrationEventHandler {
  handle(domainEvent: IIntegrationEvent): Promise<void>;
}
