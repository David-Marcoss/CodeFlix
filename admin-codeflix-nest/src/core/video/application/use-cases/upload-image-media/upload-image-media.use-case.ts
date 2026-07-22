import { IStorage } from '../../../../shared/application/storage.interface';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { Banner } from '../../../domain/banner.vo';
import { Thumbnail } from '../../../domain/thumbnail.vo';
import { ThumbnailHalf } from '../../../domain/thumbnail_half.vo';
import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { UploadImageMediaInput } from './upload-image-media.input';

export class UploadImageMediaUseCase implements IUseCase<
  UploadImageMediaInput,
  UploadImageMediaOutput
> {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {}

  async execute(input: UploadImageMediaInput): Promise<UploadImageMediaOutput> {
    const video_id = new VideoId(input.video_id);

    const existingVideo = await this.videoRepo.getById(video_id);

    if (!existingVideo) {
      throw new NotFoundError(input.video_id, Video);
    }

    const imageMap = {
      banner: Banner,
      thumbnail: Thumbnail,
      thumbnail_half: ThumbnailHalf,
    };

    const image = imageMap[input.field].createFromFile({
      ...input.file,
      video_id,
    });

    image instanceof Banner && existingVideo.replaceBanner(image);
    image instanceof Thumbnail && existingVideo.replaceThumbnail(image);
    image instanceof ThumbnailHalf && existingVideo.replaceThumbnailHalf(image);

    await this.storage.store({
      data: input.file.data,
      id: image.url,
      mime_type: input.file.mime_type,
    });

    await this.uow.do(async () => await this.videoRepo.update(existingVideo));
  }
}

export type UploadImageMediaOutput = void;
