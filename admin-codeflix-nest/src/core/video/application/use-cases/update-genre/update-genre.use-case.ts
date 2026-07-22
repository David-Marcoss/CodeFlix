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
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Rating } from '../../../domain/rating.vo';
import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video.output';
import { UpdateVideoInput } from './update-video.input';

export class UpdateVideoUseCase implements IUseCase<
  UpdateVideoInput,
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

  async execute(input: UpdateVideoInput): Promise<VideoOutput> {
    await Promise.all([
      input.categories_id &&
        this.validateCategoriesIdsExistsInDatabaseUseCase.validate(
          input.categories_id,
        ),
      input.genres_id &&
        this.validateGenresIdsExistsInDatabaseUseCase.validate(input.genres_id),
      input.cast_members_id &&
        this.validateCastMembersIdsExistsInDatabaseUseCase.validate(
          input.cast_members_id,
        ),
    ]);

    const video_id = new VideoId(input.video_id);

    const existingVideo = await this.videoRepo.getById(video_id);

    if (!existingVideo) {
      throw new NotFoundError(input.video_id, Video);
    }

    if (input.title) {
      existingVideo.changeTitle(input.title);
    }

    if (input.duration) {
      existingVideo.changeDuration(input.duration);
    }

    if (input.rating) {
      existingVideo.changeRating(Rating.create(input.rating));
    }

    if (input.description) {
      existingVideo.changeDescription(input.description);
    }

    if (input.year_launched) {
      existingVideo.changeYear(input.year_launched);
    }

    if (input.is_opened === true) {
      existingVideo.markAsOpened();
    }

    if (input.is_opened === false) {
      existingVideo.markAsNotOpened();
    }

    if (input.categories_id !== undefined) {
      existingVideo.syncCategoriesId(
        input.categories_id.map((i) => new CategoryId(i)),
      );
    }

    if (input.genres_id !== undefined) {
      existingVideo.syncGenresId(input.genres_id.map((i) => new GenreId(i)));
    }

    if (input.cast_members_id !== undefined) {
      existingVideo.syncCastMembersId(
        input.cast_members_id.map((i) => new CastMemberId(i)),
      );
    }

    if (existingVideo.notification.hasErrors()) {
      throw new EntityValidationError(existingVideo.notification.toJSON());
    }

    await this.uow.do(async () => await this.videoRepo.update(existingVideo));

    const [categories, genres, castMembers] = await Promise.all([
      this.categoryRepo.findByIds(
        Array.from(existingVideo.categories_id.values()),
      ),
      this.genreRepo.findByIds(Array.from(existingVideo.genres_id.values())),
      this.castMemberRepo.findByIds(
        Array.from(existingVideo.cast_members_id.values()),
      ),
    ]);

    return VideoOutputMapper.toOutput({
      video: existingVideo,
      allCategoriesOfVideoAndGenre: categories,
      genres,
      cast_members: castMembers,
    });
  }
}
