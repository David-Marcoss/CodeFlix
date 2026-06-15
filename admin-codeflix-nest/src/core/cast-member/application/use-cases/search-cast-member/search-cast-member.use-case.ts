import { PaginationOutput } from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SearchParamsConstructorProps } from '../../../../shared/domain/repository/search-params';
import {
  CastMemberFilter,
  ICastMemberRepository,
  CastMemberSearchParams,
} from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';

export class SearchCategoriesUseCase implements IUseCase<
  undefined,
  SearchCastMemberOutput
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(
    filters?: SearchCastMemberInput,
  ): Promise<SearchCastMemberOutput> {
    const searchParams = new CastMemberSearchParams(filters);
    const categories = await this.castMemberRepo.search(searchParams);

    const items = categories.items.map((model) =>
      CastMemberOutputMapper.toOutput(model),
    );

    return {
      ...categories,
      items,
    };
  }
}

export type SearchCastMemberInput =
  SearchParamsConstructorProps<CastMemberFilter>;
export type SearchCastMemberOutput = PaginationOutput<CastMemberOutput>;
