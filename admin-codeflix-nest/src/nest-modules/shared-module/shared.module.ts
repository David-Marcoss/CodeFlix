import { Global, Module, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudnaryStorage } from '../../core/shared/infra/storage/claudnary.storage.';
import { DomainEventMediator } from '../../core/shared/domain/events/domain-event-mediator';
import EventEmitter2 from 'eventemitter2';
import { ApplicationService } from '../../core/shared/application/aplication-service';
import { IUnitOfWork } from '../../core/shared/domain/repository/unit-of-work-interface';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorage',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        });

        return new CloudnaryStorage(cloudinary);
      },
      inject: [ConfigService],
    },
    {
      provide: DomainEventMediator,
      useValue: new DomainEventMediator(new EventEmitter2()),
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
      inject: ['UnitOfWOrk', DomainEventMediator],
    },
  ],
  exports: ['IStorage', DomainEventMediator, ApplicationService],
})
export class SharedModule {}
