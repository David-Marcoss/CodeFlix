import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export class DeleteCastMemberUseCase implements IUseCase<
  CastMemberInput,
  void
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CastMemberInput): Promise<void> {
    const castMemberId = new CastMemberId(input.cast_member_id);

    await this.castMemberRepo.delete(castMemberId);
  }
}

interface CastMemberInput {
  cast_member_id: string;
}
