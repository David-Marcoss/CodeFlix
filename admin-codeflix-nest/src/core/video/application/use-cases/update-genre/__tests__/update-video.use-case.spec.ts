import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { NotFoundError } from '../../../../../shared/domain/errors/notFoundError';
import { Category } from '../../../../../category/domain/category.aggregate';
import { VideoSequelizeRepository } from '../../../../infra/sequelize/video-sequelize.repository';
import { ValidateCategoriesIdsExistsInDatabaseUseCase } from '../../../../../category/application/use-cases/validations/validate-categories-ids-exists-in-database';
import { VideoModel } from '../../../../infra/sequelize/video-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { ValidateGenresIdsExistsInDatabaseUseCase } from '../../../../../genre/application/use-cases/validations/validate-genres-ids-exists-in-database';
import { CastMemberSequelizeRepository } from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { ValidateCastMembersIdsExistsInDatabaseUseCase } from '../../../../../cast-member/application/use-cases/validations/validate-cast_members-ids-exists-in-database';
import { setupSequelizeForVideo } from '../../../../infra/sequelize/testing/helper';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { CastMemberModel } from '../../../../../cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberFakeBuilder } from '../../../../../cast-member/domain/category-fake.builder';
import { GenreFakeBuilder } from '../../../../../genre/domain/genre-fake.builder';
import { VideoFakeBuilder } from '../../../../domain/video-fake-builder';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import {
  CreateVideoInput,
  CreateVideoUseCase,
} from '../../create-video/create-video.use-case';
import { UpdateVideoInput } from '../update-video.input';
import { RatingValues } from '../../../../domain/rating.vo';
import { UpdateVideoUseCase } from '../update-genre.use-case';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';

describe('Update Video use-case integration tests', () => {
  let videoRepository: VideoSequelizeRepository;
  let unitOfWOrk: UnitOfWorkSequelize;
  let categoryRepository: CategorySequelizeRepository;
  let validateCategoriesIds: ValidateCategoriesIdsExistsInDatabaseUseCase;
  let genreRepository: GenreSequelizeRepository;
  let validateGenresIds: ValidateGenresIdsExistsInDatabaseUseCase;
  let castMemberRepository: CastMemberSequelizeRepository;
  let validateCastMembersIds: ValidateCastMembersIdsExistsInDatabaseUseCase;

  const setup = setupSequelizeForVideo();

  beforeEach(async () => {
    unitOfWOrk = new UnitOfWorkSequelize(setup.sequelize);
    videoRepository = new VideoSequelizeRepository(VideoModel, unitOfWOrk);
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    validateCategoriesIds = new ValidateCategoriesIdsExistsInDatabaseUseCase(
      categoryRepository,
    );

    genreRepository = new GenreSequelizeRepository(GenreModel);
    validateGenresIds = new ValidateGenresIdsExistsInDatabaseUseCase(
      genreRepository,
    );

    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
    validateCastMembersIds = new ValidateCastMembersIdsExistsInDatabaseUseCase(
      castMemberRepository,
    );
  });

  it('should update a new video', async () => {
    const createUseCase = new CreateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    const categories = CategoryFakeBuilder.aCategory().build();
    const castMembers = CastMemberFakeBuilder.aCastMember().build();
    const genres = GenreFakeBuilder.aGenre()
      .addCategoryId(categories.category_id)
      .build();

    await categoryRepository.create(categories);
    await castMemberRepository.create(castMembers);
    await genreRepository.create(genres);

    const video = VideoFakeBuilder.aVideoWithoutMedias()
      .addCastMemberId(castMembers.cast_member_id)
      .addCategoryId(categories.category_id)
      .addGenreId(genres.genre_id)
      .build();

    const input: CreateVideoInput = {
      title: video.title,
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (c) => c.id,
      ),
      genres_id: Array.from(video.genres_id.values()).map((c) => c.id),
      description: video.description,
      duration: video.duration,
      is_opened: video.is_opened,
      rating: video.rating.value,
      year_launched: video.year_launched,
    };

    const result = await createUseCase.execute(input);

    const videoCreated = await videoRepository.getById(new VideoId(result.id));

    expect(videoCreated?.toJSON()).toStrictEqual({
      ...video.toJSON(),
      video_id: result.id,
      created_at: result.created_at,
    });

    const updateVideo: UpdateVideoInput = {
      video_id: result.id,
      title: 'video updated',
      rating: RatingValues.R10,
      is_opened: true,
    };

    const updateUseCase = new UpdateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    await updateUseCase.execute(updateVideo);

    const videoUpdated = await videoRepository.getById(new VideoId(result.id));

    expect(videoUpdated?.toJSON()).toStrictEqual({
      ...video.toJSON(),
      video_id: result.id,
      created_at: result.created_at,
      title: updateVideo.title,
      rating: updateVideo.rating,
      is_opened: updateVideo.is_opened,
    });
  });

  it('should return null when video is not found', async () => {
    const videoId = new VideoId();
    const updateUseCase = new UpdateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    const updateVideo: UpdateVideoInput = {
      video_id: videoId.id,
      title: 'video updated',
      rating: RatingValues.R10,
      is_opened: true,
    };

    await expect(updateUseCase.execute(updateVideo)).rejects.toThrow(
      new NotFoundError(videoId, Video),
    );
  });

  it('should throw error when update video has invalid categories_id', async () => {
    const createUseCase = new CreateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    const categories = CategoryFakeBuilder.aCategory().build();
    const castMembers = CastMemberFakeBuilder.aCastMember().build();
    const genres = GenreFakeBuilder.aGenre()
      .addCategoryId(categories.category_id)
      .build();

    await categoryRepository.create(categories);
    await castMemberRepository.create(castMembers);
    await genreRepository.create(genres);

    const video = VideoFakeBuilder.aVideoWithoutMedias()
      .addCastMemberId(castMembers.cast_member_id)
      .addCategoryId(categories.category_id)
      .addGenreId(genres.genre_id)
      .build();

    const input: CreateVideoInput = {
      title: video.title,
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (c) => c.id,
      ),
      genres_id: Array.from(video.genres_id.values()).map((c) => c.id),
      description: video.description,
      duration: video.duration,
      is_opened: video.is_opened,
      rating: video.rating.value,
      year_launched: video.year_launched,
    };

    const result = await createUseCase.execute(input);

    const videoCreated = await videoRepository.getById(new VideoId(result.id));

    expect(videoCreated?.toJSON()).toStrictEqual({
      ...video.toJSON(),
      video_id: result.id,
      created_at: result.created_at,
    });

    const invalidIds = [
      'c9cc0849-ee31-48a2-9503-7bec32445a8b',
      '82126de7-ff65-4405-b386-d81809b62e86',
    ];

    const updateVideo: UpdateVideoInput = {
      video_id: result.id,
      title: 'video updated',
      rating: RatingValues.R10,
      is_opened: true,
      categories_id: invalidIds,
    };

    const updateUseCase = new UpdateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    await expect(updateUseCase.execute(updateVideo)).rejects.toThrow(
      new NotFoundError(invalidIds, Category),
    );
  });

  it('should throw error when update video has invalid genres_id', async () => {
    const createUseCase = new CreateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    const categories = CategoryFakeBuilder.aCategory().build();
    const castMembers = CastMemberFakeBuilder.aCastMember().build();
    const genres = GenreFakeBuilder.aGenre()
      .addCategoryId(categories.category_id)
      .build();

    await categoryRepository.create(categories);
    await castMemberRepository.create(castMembers);
    await genreRepository.create(genres);

    const video = VideoFakeBuilder.aVideoWithoutMedias()
      .addCastMemberId(castMembers.cast_member_id)
      .addCategoryId(categories.category_id)
      .addGenreId(genres.genre_id)
      .build();

    const input: CreateVideoInput = {
      title: video.title,
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (c) => c.id,
      ),
      genres_id: Array.from(video.genres_id.values()).map((c) => c.id),
      description: video.description,
      duration: video.duration,
      is_opened: video.is_opened,
      rating: video.rating.value,
      year_launched: video.year_launched,
    };

    const result = await createUseCase.execute(input);

    const videoCreated = await videoRepository.getById(new VideoId(result.id));

    expect(videoCreated?.toJSON()).toStrictEqual({
      ...video.toJSON(),
      video_id: result.id,
      created_at: result.created_at,
    });

    const invalidIds = [
      'c9cc0849-ee31-48a2-9503-7bec32445a8b',
      '82126de7-ff65-4405-b386-d81809b62e86',
    ];

    const updateVideo: UpdateVideoInput = {
      video_id: result.id,
      title: 'video updated',
      rating: RatingValues.R10,
      is_opened: true,
      genres_id: invalidIds,
    };

    const updateUseCase = new UpdateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    await expect(updateUseCase.execute(updateVideo)).rejects.toThrow(
      new NotFoundError(invalidIds, Genre),
    );
  });

  it('should throw error when update video has invalid cast_member_id', async () => {
    const createUseCase = new CreateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    const categories = CategoryFakeBuilder.aCategory().build();
    const castMembers = CastMemberFakeBuilder.aCastMember().build();
    const genres = GenreFakeBuilder.aGenre()
      .addCategoryId(categories.category_id)
      .build();

    await categoryRepository.create(categories);
    await castMemberRepository.create(castMembers);
    await genreRepository.create(genres);

    const video = VideoFakeBuilder.aVideoWithoutMedias()
      .addCastMemberId(castMembers.cast_member_id)
      .addCategoryId(categories.category_id)
      .addGenreId(genres.genre_id)
      .build();

    const input: CreateVideoInput = {
      title: video.title,
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (c) => c.id,
      ),
      genres_id: Array.from(video.genres_id.values()).map((c) => c.id),
      description: video.description,
      duration: video.duration,
      is_opened: video.is_opened,
      rating: video.rating.value,
      year_launched: video.year_launched,
    };

    const result = await createUseCase.execute(input);

    const videoCreated = await videoRepository.getById(new VideoId(result.id));

    expect(videoCreated?.toJSON()).toStrictEqual({
      ...video.toJSON(),
      video_id: result.id,
      created_at: result.created_at,
    });

    const invalidIds = [
      'c9cc0849-ee31-48a2-9503-7bec32445a8b',
      '82126de7-ff65-4405-b386-d81809b62e86',
    ];

    const updateVideo: UpdateVideoInput = {
      video_id: result.id,
      title: 'video updated',
      rating: RatingValues.R10,
      is_opened: true,
      cast_members_id: invalidIds,
    };

    const updateUseCase = new UpdateVideoUseCase(
      unitOfWOrk,
      videoRepository,
      categoryRepository,
      validateCategoriesIds,
      genreRepository,
      validateGenresIds,
      castMemberRepository,
      validateCastMembersIds,
    );

    await expect(updateUseCase.execute(updateVideo)).rejects.toThrow(
      new NotFoundError(invalidIds, CastMember),
    );
  });
});
