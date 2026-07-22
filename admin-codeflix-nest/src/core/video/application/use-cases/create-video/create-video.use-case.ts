import { ValidateCastMembersIdsExistsInDatabaseUseCase } from '../../../../cast-member/application/use-cases/validations/validate-cast_members-ids-exists-in-database';
import { CastMemberId } from '../../../../cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../../cast-member/domain/cast-member.repository';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../../../category/application/use-cases/validations/validate-categories-ids-exists-in-database';
import { CategoryId } from '../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { ValidateGenresIdsExistsInDatabaseUseCase } from '../../../../genre/application/use-cases/validations/validate-genres-ids-exists-in-database';
import { GenreId } from '../../../../genre/domain/genre.aggregate';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Rating } from '../../../domain/rating.vo';
import { Video } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video.output';

import { CreateVideoInput } from './create-video.input';

export { CreateVideoInput } from './create-video.input';

export class CreateVideoUseCase implements IUseCase<
  CreateVideoInput,
  VideoOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private validateCategoriesIdsExistsInDatabaseUseCase: ValidateCategoriesIdsExistsInDatabaseUseCase,
    private genreRepo: IGenreRepository,
    private validateGenresIdsExistsInDatabaseUseCase: ValidateGenresIdsExistsInDatabaseUseCase,
    private castMemberRepo: ICastMemberRepository,
    private validateCastMembersIdsExistsInDatabaseUseCase: ValidateCastMembersIdsExistsInDatabaseUseCase,
  ) {}

  async execute(input: CreateVideoInput): Promise<VideoOutput> {
    await Promise.all([
      this.validateCategoriesIdsExistsInDatabaseUseCase.validate(
        input.categories_id,
      ),
      this.validateGenresIdsExistsInDatabaseUseCase.validate(input.genres_id),
      this.validateCastMembersIdsExistsInDatabaseUseCase.validate(
        input.cast_members_id,
      ),
    ]);

    const video = Video.create({
      ...input,
      categories_id: input.categories_id.map((id) => new CategoryId(id)),
      genres_id: input.genres_id.map((id) => new GenreId(id)),
      cast_members_id: input.cast_members_id.map((id) => new CastMemberId(id)),
      rating: Rating.create(input.rating),
    });

    if (video.notification.hasErrors()) {
      throw new EntityValidationError(video.notification.toJSON());
    }

    // execulta a operação em uma transação
    await this.uow.do(async () => {
      return await this.videoRepo.create(video);
    });

    const [categories, genres, castMembers] = await Promise.all([
      this.categoryRepo.findByIds(Array.from(video.categories_id.values())),
      this.genreRepo.findByIds(Array.from(video.genres_id.values())),
      this.castMemberRepo.findByIds(Array.from(video.cast_members_id.values())),
    ]);

    return VideoOutputMapper.toOutput({
      video,
      allCategoriesOfVideoAndGenre: categories,
      genres,
      cast_members: castMembers,
    });
  }
}
