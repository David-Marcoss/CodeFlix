import { IStorage } from '../../../../shared/application/storage.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work-interface';
import { NotFoundError } from '../../../../shared/domain/errors/notFoundError';
import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';

export class DeleteVideoUseCase {
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {}

  async execute(input: { video_id: string }): Promise<void> {
    const id = new VideoId(input.video_id);
    const video = await this.videoRepo.getById(id);
    if (!video) throw new NotFoundError(input.video_id, Video);

    // Keep database references until all remote deletions succeed, allowing retries.
    const files = new Map<string, string>();
    for (const image of [video.banner, video.thumbnail, video.thumbnail_half]) {
      if (image) files.set(`${image.location}/${image.name}`, 'image/jpeg');
    }
    for (const media of [video.video, video.trailer]) {
      if (media) files.set(`${media.raw_location}/${media.name}`, 'video/mp4');
    }
    for (const [fileId, mimeType] of files) {
      await this.storage.deleteFile(fileId, mimeType);
    }
    await this.uow.do(() => this.videoRepo.delete(id));
  }
}
