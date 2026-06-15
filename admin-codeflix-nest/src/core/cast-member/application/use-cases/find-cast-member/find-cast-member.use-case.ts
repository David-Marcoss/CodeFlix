import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';

export class FindCastMemberUseCase implements IUseCase<
  CastMemberInput,
  CastMemberOutput | null
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CastMemberInput): Promise<CastMemberOutput | null> {
    const castMemberId = new CastMemberId(input.cast_member_id);
    const existingCastMember = await this.castMemberRepo.getById(castMemberId);

    if (existingCastMember) {
      return CastMemberOutputMapper.toOutput(existingCastMember);
    }

    return null;
  }
}

interface CastMemberInput {
  cast_member_id: string;
}
