import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CastMemberType } from '../../../domain/cast-member-type.vo';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';

export class UpdateCastMemberUseCase implements IUseCase<
  UpdateCastMemberInput,
  CastMemberOutput
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: UpdateCastMemberInput): Promise<CastMemberOutput> {
    const cast_member_id = new CastMemberId(input.cast_member_id);

    const existingCastMember =
      await this.castMemberRepo.getById(cast_member_id);

    if (!existingCastMember) {
      throw new NotFoundError(input.cast_member_id, CastMember);
    }

    if (input.name) {
      existingCastMember.changeName(input.name);
    }

    if (input.type !== undefined) {
      existingCastMember.changeType(new CastMemberType(input.type));
    }

    if (existingCastMember.notification.hasErrors()) {
      throw new EntityValidationError(existingCastMember.notification.toJSON());
    }

    await this.castMemberRepo.update(existingCastMember);

    return CastMemberOutputMapper.toOutput(existingCastMember);
  }
}
