import { ICastMemberRepository } from '../../../../cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video.output';

export class FindVideoUseCase implements IUseCase<
  VideoInput,
  VideoOutput | null
> {
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}

  async execute(input: VideoInput): Promise<VideoOutput | null> {
    const videoId = new VideoId(input.video_id);
    const existingVideo = await this.videoRepo.getById(videoId);

    if (existingVideo) {
      const [genres, castMembers] = await Promise.all([
        this.genreRepo.findByIds(Array.from(existingVideo.genres_id.values())),
        this.castMemberRepo.findByIds(
          Array.from(existingVideo.cast_members_id.values()),
        ),
      ]);

      const categoryIds = new Map(existingVideo.categories_id);
      genres.forEach((genre) => {
        genre.categories_id.forEach((categoryId, id) => {
          categoryIds.set(id, categoryId);
        });
      });

      const categories = await this.categoryRepo.findByIds(
        Array.from(categoryIds.values()),
      );

      return VideoOutputMapper.toOutput({
        video: existingVideo,
        allCategoriesOfVideoAndGenre: categories,
        genres,
        cast_members: castMembers,
      });
    }

    return null;
  }
}

interface VideoInput {
  video_id: string;
}
