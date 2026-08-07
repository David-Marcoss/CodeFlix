import EventEmitter2 from 'eventemitter2';
import { DomainEventMediator } from '../../domain/events/domain-event-mediator';

import { AggregateRoot } from '../../domain/aggregate-root';
import { ValueObject } from '../../domain/value-object';
import { IUnitOfWork } from '../../domain/repository/unit-of-work-interface';
import { ApplicationService } from '../aplication-service';
import { UnitOfWorkFakeInMemory } from '../../infra/db/sequelize/fake-unit-of-work-sequelise';

class StubAggregateRoot extends AggregateRoot {
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON() {
    throw new Error('Method not implemented.');
  }
}

describe('ApplicationService Unit Tests', () => {
  let uow: IUnitOfWork;
  let domainEventMediator: DomainEventMediator;
  let applicationService: ApplicationService;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    const eventEmitter = new EventEmitter2();
    domainEventMediator = new DomainEventMediator(eventEmitter);
    applicationService = new ApplicationService(uow, domainEventMediator);
  });

  describe('start', () => {
    it('should call the start method of unit of work', async () => {
      const startSpy = jest.spyOn(uow, 'start');
      await applicationService.start();
      expect(startSpy).toHaveBeenCalled();
    });
  });

  describe('finish', () => {
    it('should call the publish method of domain event mediator and the commit method', async () => {
      const aggregateRoot = new StubAggregateRoot();
      uow.addAggregateRoot(aggregateRoot);
      const publishSpy = jest.spyOn(domainEventMediator, 'publish');
      const publishIntegrationEventsSpy = jest.spyOn(
        domainEventMediator,
        'publishIntegrationEvents',
      );
      const commitSpy = jest.spyOn(uow, 'commit');
      await applicationService.finish();
      expect(publishSpy).toHaveBeenCalledWith(aggregateRoot);
      expect(publishIntegrationEventsSpy).toHaveBeenCalledWith(aggregateRoot);
      expect(commitSpy).toHaveBeenCalled();
      expect(publishSpy).toHaveBeenCalledWith(aggregateRoot);
      expect(uow.getAggregateRoots()).toHaveLength(0);
    });
  });

  describe('fail', () => {
    it('should call the rollback method of unit of work', async () => {
      const rollbackSpy = jest.spyOn(uow, 'rollback');
      await applicationService.fail();
      expect(rollbackSpy).toHaveBeenCalled();
    });
  });

  describe('run', () => {
    it('should start, execute the callback, finish and return the result', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      const spyStart = jest.spyOn(applicationService, 'start');
      const spyFinish = jest.spyOn(applicationService, 'finish');

      const result = await applicationService.run(callback);

      expect(spyStart).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
      expect(spyFinish).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should rollback and throw the error if the callback throws an error', async () => {
      const callback = jest.fn().mockRejectedValue(new Error('test-error'));
      const spyFail = jest.spyOn(applicationService, 'fail');
      await expect(applicationService.run(callback)).rejects.toThrow(
        'test-error',
      );
      expect(spyFail).toHaveBeenCalled();
    });

    it('should not rollback a transaction already committed when integration event publishing fails', async () => {
      const aggregateRoot = new StubAggregateRoot();
      const integrationError = new Error('integration-error');
      const rollbackSpy = jest.spyOn(uow, 'rollback');
      jest
        .spyOn(domainEventMediator, 'publishIntegrationEvents')
        .mockRejectedValue(integrationError);

      await expect(
        applicationService.run(async () => {
          uow.addAggregateRoot(aggregateRoot);
        }),
      ).rejects.toThrow(integrationError);

      expect(rollbackSpy).not.toHaveBeenCalled();
      expect(uow.getAggregateRoots()).toHaveLength(0);
    });
  });
});
