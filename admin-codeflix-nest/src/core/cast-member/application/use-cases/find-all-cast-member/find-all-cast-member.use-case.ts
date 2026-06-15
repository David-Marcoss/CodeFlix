import { IUseCase } from '../../../../shared/application/use-case.interface';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';

export class FindAllCategoriesUseCase implements IUseCase<
  undefined,
  CastMemberOutput[]
> {
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(): Promise<CastMemberOutput[]> {
    const categories = await this.castMemberRepo.getAll();

    return categories.map((castMember) =>
      CastMemberOutputMapper.toOutput(castMember),
    );
  }
}
