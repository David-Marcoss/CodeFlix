import { Exclude, Expose } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from './pagination.presenter';

// abstração para presenter de coleção, que pode ser reutilizada em outros módulos, como por exemplo, o módulo de vídeos
export abstract class CollectionPresenter {
  // não aplica serialização para o paginationPresenter, pois ele é usado internamente para compor a resposta
  @Exclude()
  protected paginationPresenter: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  get meta() {
    return this.paginationPresenter;
  }

  abstract get data();
}
