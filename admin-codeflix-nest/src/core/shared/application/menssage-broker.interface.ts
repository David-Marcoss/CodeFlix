import { IDomainEvent } from '../domain/events/domain-events.interface';

export interface IMenssageBroker {
  publishEvent(domainEvent: IDomainEvent): Promise<void>;
}
