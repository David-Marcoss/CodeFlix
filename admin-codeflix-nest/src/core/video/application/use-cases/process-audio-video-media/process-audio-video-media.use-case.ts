import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { AudioVideoMediaStatus } from '../../../../shared/domain/value-objects/audio-video-media.vo';

import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { ProcessAudioVideoMediaInput } from './process-audio-video-media.input';

export class ProcessAudioVideoMediaUseCase implements IUseCase<
  ProcessAudioVideoMediaInput,
  ProcessAudioVideoMediaOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
  ) {}

  async execute(
    input: ProcessAudioVideoMediaInput,
  ): Promise<ProcessAudioVideoMediaOutput> {
    const video_id = new VideoId(input.video_id);

    const existingVideo = await this.videoRepo.getById(video_id);

    if (!existingVideo) {
      throw new NotFoundError(input.video_id, Video);
    }

    if (input.field === 'trailer') {
      if (!existingVideo.trailer) {
        throw new Error('Trailer not found');
      }

      const trailer =
        input.status === AudioVideoMediaStatus.COMPLETED
          ? existingVideo.trailer.complete(input.encoded_location)
          : existingVideo.trailer.fail();

      existingVideo.trailer = trailer;
    }

    if (input.field === 'video') {
      if (!existingVideo.video) {
        throw new Error('Video not found');
      }

      const video =
        input.status === AudioVideoMediaStatus.COMPLETED
          ? existingVideo.video.complete(input.encoded_location)
          : existingVideo.video.fail();

      existingVideo.video = video;
    }

    await this.uow.do(async () => await this.videoRepo.update(existingVideo));
  }
}

export type ProcessAudioVideoMediaOutput = void;
