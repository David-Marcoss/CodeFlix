import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';

export class ValidateCastMembersIdsExistsInDatabaseUseCase {
  constructor(private castMemberRepo: ICategoryRepository) {}

  async validate(cast_members_id: string[]): Promise<void> {
    const result = await this.castMemberRepo.existsById(
      cast_members_id.map((i) => new CastMemberId(i)),
    );

    if (result.not_exists.length > 0) {
      throw new NotFoundError(result.not_exists, CastMember);
    }
  }
}
