import { CastMember, CastMemberId } from './cast-member.aggregate';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';

export type CastMemberFilter = string | undefined;

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository extends ISearchableRepository<
  CastMember,
  CastMemberId,
  CastMemberFilter,
  CastMemberSearchParams,
  CastMemberSearchResult
> {}
