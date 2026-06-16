import { SearchCastMemberInput } from '../../../core/cast-member/application/use-cases/search-cast-member/search-cast-member.use-case';

export class SearchCastMemberDto implements SearchCastMemberInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
  filter?: string;
}
