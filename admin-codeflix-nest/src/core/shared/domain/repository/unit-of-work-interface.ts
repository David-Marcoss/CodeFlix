//UnitOfWork -> Responsavel por gerenciar as operações de transactions nos repositorios

import { AggregateRoot } from '../aggregate-root';

export interface IUnitOfWork {
  start: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  getTransaction: () => any;
  do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
  addAggregateRoot: (aggregate: AggregateRoot) => void;
  getAggregateRoots: () => AggregateRoot[];
}
