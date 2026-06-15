import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import { CastMemberOutput } from '../common/cast-member-output';
import { CreateCastMemberInput } from './create-cast-member.input';

export class CreateCastMemberUseCase implements IUseCase<
  CreateCastMemberInput,
  CastMemberOutput
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
    const castMember = CastMember.create({
      ...input,
      type: new CastMemberType(input.type),
    });

    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }

    await this.castMemberRepo.create(castMember);

    return castMember.toJSON();
  }
}
