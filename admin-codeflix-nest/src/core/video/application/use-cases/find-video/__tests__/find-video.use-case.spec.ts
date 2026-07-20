import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
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
import { VideoId } from '../../../../domain/video.aggregate';
import {
  CreateVideoInput,
  CreateVideoUseCase,
} from '../../create-video/create-video.use-case';
import { FindVideoUseCase } from '../find-video.use-case';

describe('Find Video use-case integration tests', () => {
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

  it('should find a video', async () => {
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

    const findUseCase = new FindVideoUseCase(
      videoRepository,
      categoryRepository,
      genreRepository,
      castMemberRepository,
    );

    const categories = CategoryFakeBuilder.theCategories(2).build();
    const castMembers = CastMemberFakeBuilder.aCastMember().build();
    const genres = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[1].category_id)
      .build();

    await categoryRepository.createMany(categories);
    await castMemberRepository.create(castMembers);
    await genreRepository.create(genres);

    const video = VideoFakeBuilder.aVideoWithoutMedias()
      .addCastMemberId(castMembers.cast_member_id)
      .addCategoryId(categories[0].category_id)
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

    const output = await findUseCase.execute({ video_id: result.id });

    const categoryOutput = {
      id: categories[0].category_id.id,
      name: categories[0].name,
      created_at: categories[0].created_at,
    };
    const genreCategoryOutput = {
      id: categories[1].category_id.id,
      name: categories[1].name,
      created_at: categories[1].created_at,
    };

    expect(output).toStrictEqual({
      id: result.id,
      title: video.title,
      description: video.description,
      year_launched: video.year_launched,
      duration: video.duration,
      rating: video.rating.value,
      is_opened: video.is_opened,
      is_published: false,
      categories_id: [categories[0].category_id.id],
      categories: [categoryOutput],
      genres_id: [genres.genre_id.id],
      genres: [
        {
          id: genres.genre_id.id,
          name: genres.name,
          is_active: genres.is_active,
          categories_id: [categories[1].category_id.id],
          categories: [genreCategoryOutput],
          created_at: genres.created_at,
        },
      ],
      cast_members_id: [castMembers.cast_member_id.id],
      cast_members: [
        {
          id: castMembers.cast_member_id.id,
          name: castMembers.name,
          type: castMembers.type,
          created_at: castMembers.created_at,
        },
      ],
      created_at: result.created_at,
    });
  });

  it('should return null when video is not found', async () => {
    const videoId = new VideoId();
    const findUseCase = new FindVideoUseCase(
      videoRepository,
      categoryRepository,
      genreRepository,
      castMemberRepository,
    );

    const output = await findUseCase.execute({ video_id: videoId.id });

    expect(output).toBeNull();
  });
});
