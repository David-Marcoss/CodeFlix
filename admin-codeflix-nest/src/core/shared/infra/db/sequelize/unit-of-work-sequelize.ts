//UnitOfWork -> Responsavel por gerenciar as operações de transactions nos repositorios

import { Sequelize, Transaction } from 'sequelize';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work-interface';

export class UnitOfWorkSequelize implements IUnitOfWork {
  private transaction: Transaction | null = null;
  constructor(private sequelize: Sequelize) {}

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
    let isAutoTransaction = false;
    try {
      if (this.transaction) {
        const result = workFn(this);
        this.transaction = null;

        return result;
      }

      return await this.sequelize.transaction((t) => {
        isAutoTransaction = true;
        this.transaction = t;
        const result = workFn(this);
        this.transaction = null;

        return result;
      });
    } catch (error) {
      console.log(error);

      if (isAutoTransaction) {
        await this.transaction?.rollback();
      }

      this.transaction = null;

      throw error;
    }
  }

  private setTransactionError(): Error {
    throw new Error('Transaction not defined');
  }
}
