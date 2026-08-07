import { AggregateRoot } from '../../../domain/aggregate-root';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work-interface';

export class UnitOfWorkFakeInMemory implements IUnitOfWork {
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();
  private transaction: object | null = null;

  constructor() {}

  async start(): Promise<void> {
    this.transaction = {};
  }

  async commit(): Promise<void> {
    this.transaction = null;
  }

  async rollback(): Promise<void> {
    this.transaction = null;
  }

  do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return workFn(this);
  }

  getTransaction() {
    return this.transaction;
  }

  addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }
  getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }

  clearAggregateRoots(): void {
    this.aggregateRoots.clear();
  }
}
