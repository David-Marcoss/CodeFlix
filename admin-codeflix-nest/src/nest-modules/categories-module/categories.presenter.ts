import { Transform } from 'class-transformer';
import { CategoryOutput } from '../../core/category/application/use-cases/common/category-output';
import { SearchCategoryOutput } from '../../core/category/application/use-cases/search-categories/search-categories.use-case';
import { CollectionPresenter } from '../shared-module/collection.presenter';

// O presenter é responsável por transformar a saída do caso de uso em um formato adequado para a resposta da API,
//  aplicando as regras de formatação necessárias (ex: formatação de datas, exclusão de campos sensíveis, etc).
//  Ele é uma camada de apresentação que fica entre o caso de uso e o controlador,
// garantindo que a resposta da API esteja no formato esperado pelos clientes.

export class CategoryPresenter {
  category_id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.category_id = output.category_id;
    this.name = output.name;
    this.description = output.description || null;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: SearchCategoryOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new CategoryPresenter(i));
  }
}
