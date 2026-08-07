import { Global, Module, Scope } from '@nestjs/common';
import { ApplicationService } from '../../core/shared/application/aplication-service';
import { IUnitOfWork } from '../../core/shared/domain/repository/unit-of-work-interface';
import { DomainEventMediator } from '../../core/shared/domain/events/domain-event-mediator';
import { Sequelize } from 'sequelize';
import { UnitOfWorkSequelize } from '../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { getConnectionToken } from '@nestjs/sequelize';

// Responsavel por cordenar a execulção de use cases mais complexos com transaction e eventos

@Global()
@Module({
  providers: [
    {
      provide: 'UnitOfWork',
      useFactory: (sequelize: Sequelize) => {
        return new UnitOfWorkSequelize(sequelize);
      },
      scope: Scope.REQUEST,
      inject: [getConnectionToken()],
    },
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventMediator: DomainEventMediator,
      ) => {
        return new ApplicationService(uow, domainEventMediator);
      },
      scope: Scope.REQUEST,
      inject: ['UnitOfWork', DomainEventMediator],
    },
  ],
  exports: ['UnitOfWork', ApplicationService],
})
export class UsecaseModule {}
