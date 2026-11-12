import { ListVideosOutput } from '../../core/video/application/use-cases/list-videos/list-videos.use-case';
import { VideoOutput } from '../../core/video/application/use-cases/common/video.output';
import { CollectionPresenter } from '../shared-module/collection.presenter';

export class VideoCollectionPresenter extends CollectionPresenter {
  data: VideoOutput[];

  constructor(output: ListVideosOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items;
  }
}
