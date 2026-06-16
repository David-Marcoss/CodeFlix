import { Transform } from 'class-transformer';
import { CastMemberOutput } from '../../core/cast-member/application/use-cases/common/cast-member-output';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import { SearchCastMemberOutput } from '../../core/cast-member/application/use-cases/search-cast-member/search-cast-member.use-case';

export class CastMemberPresenter {
  cast_member_id: string;
  name: string;
  type?: 'director' | 'actor';
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.cast_member_id = output.cast_member_id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[];

  constructor(output: SearchCastMemberOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new CastMemberPresenter(i));
  }
}
