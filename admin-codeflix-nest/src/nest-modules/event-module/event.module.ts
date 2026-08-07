import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DomainEventMediator } from '../../core/shared/domain/events/domain-event-mediator';

// Responsavel por gerenciar a criação dos eventos

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    {
      provide: DomainEventMediator,
      useFactory: (eventEmitter: EventEmitter2) =>
        new DomainEventMediator(eventEmitter),
      inject: [EventEmitter2],
    },
  ],
  exports: [DomainEventMediator],
})
export class EventModule {}
