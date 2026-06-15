import { CastMember } from '../../../domain/cast-member.aggregate';

export type CastMemberOutput = {
  cast_member_id: string;
  name: string;
  type: 'actor' | 'director';
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(castMember: CastMember): CastMemberOutput {
    return castMember.toJSON();
  }
}
