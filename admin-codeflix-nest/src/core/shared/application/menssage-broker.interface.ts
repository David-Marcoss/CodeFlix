import { IIntegrationEvent } from '../domain/events/domain-events.interface';

export interface IMenssageBroker {
  publishEvent(domainEvent: IIntegrationEvent): Promise<void>;
}
