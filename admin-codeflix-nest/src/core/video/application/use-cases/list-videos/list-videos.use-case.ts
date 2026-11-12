import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { SearchParamsConstructorProps } from '../../../../shared/domain/repository/search-params';
import {
  VideoFilter,
  VideoSearchParams,
  IVideoRepository,
} from '../../../domain/video.repository';
import { FindVideoUseCase } from '../find-video/find-video.use-case';
import { VideoOutput } from '../common/video.output';

export class ListVideosUseCase {
  constructor(
    private readonly videoRepo: IVideoRepository,
    private readonly findVideo: FindVideoUseCase,
  ) {}

  async execute(input: ListVideosInput = {}): Promise<ListVideosOutput> {
    const result = await this.videoRepo.search(
      VideoSearchParams.create({ ...input, filter: input.filter ?? undefined }),
    );
    const items = await Promise.all(
      result.items.map((video) => this.findVideo.toOutput(video)),
    );
    return PaginationOutputMapper.toOutput(items, result);
  }
}

export type ListVideosInput = SearchParamsConstructorProps<VideoFilter>;
export type ListVideosOutput = PaginationOutput<VideoOutput>;
