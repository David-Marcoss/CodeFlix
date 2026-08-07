//UnitOfWork -> Responsavel por gerenciar as operações de transactions nos repositorios

import { Sequelize, Transaction } from 'sequelize';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work-interface';
import { AggregateRoot } from '../../../domain/aggregate-root';

export class UnitOfWorkSequelize implements IUnitOfWork {
  private transaction: Transaction | null = null;
  private agregatesRoot = new Set<AggregateRoot>();

  constructor(private sequelize: Sequelize) {}

  addAggregateRoot(aggregate: AggregateRoot) {
    this.agregatesRoot.add(aggregate);
  }

  getAggregateRoots() {
    return Array.from(this.agregatesRoot);
  }

  clearAggregateRoots(): void {
    this.agregatesRoot.clear();
  }

  async start(): Promise<void> {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
    }
  }
  async commit(): Promise<void> {
    if (!this.transaction) {
      this.setTransactionError();
    }
    await this.transaction!.commit();
    this.transaction = null;
  }

  async rollback(): Promise<void> {
    if (!this.transaction) {
      this.setTransactionError();
    }
    await this.transaction!.rollback();
    this.transaction = null;
  }

  getTransaction(): any {
    return this.transaction;
  }

  async do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    if (this.transaction) {
      return await workFn(this);
    }

    try {
      return await this.sequelize.transaction(async (transaction) => {
        this.transaction = transaction;
        try {
          return await workFn(this);
        } finally {
          this.transaction = null;
        }
      });
    } finally {
      this.getAggregateRoots().forEach((aggregateRoot) =>
        aggregateRoot.clearEvents(),
      );
      this.clearAggregateRoots();
    }
  }

  private setTransactionError(): Error {
    throw new Error('Transaction not defined');
  }
}
