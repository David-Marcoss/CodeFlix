import { IStorage } from '../../../../shared/application/storage.interface';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { Trailer } from '../../../domain/trailer.vo';
import { VideoMedia } from '../../../domain/video-media.vo';

import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { UploadAudioVideoMediaInput } from './upload-audio-video-media.input';

export class UploadAudioVideoMediaUseCase implements IUseCase<
  UploadAudioVideoMediaInput,
  UploadAudioVideoMediaOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {}

  async execute(
    input: UploadAudioVideoMediaInput,
  ): Promise<UploadAudioVideoMediaOutput> {
    const video_id = new VideoId(input.video_id);

    const existingVideo = await this.videoRepo.getById(video_id);

    if (!existingVideo) {
      throw new NotFoundError(input.video_id, Video);
    }

    const imageMap = {
      trailer: Trailer,
      video: VideoMedia,
    };

    const image = imageMap[input.field].createFromFile({
      ...input.file,
      video_id,
    });

    image instanceof Trailer && existingVideo.replaceTrailer(image);
    image instanceof VideoMedia && existingVideo.replaceVideo(image);

    await this.storage.store({
      data: input.file.data,
      id: image.url,
      mime_type: input.file.mime_type,
    });

    await this.uow.do(async () => await this.videoRepo.update(existingVideo));
  }
}

export type UploadAudioVideoMediaOutput = void;
