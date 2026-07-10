import { MediaFileValidator } from '../../shared/domain/validators/media-file-validator';
import { ImageMedia } from '../../shared/domain/value-objects/image-media.vo';
import { VideoId } from './video.aggregate';

// ThumbnailHalf imagems para celular
export class ThumbnailHalf extends ImageMedia {
  static max_size = 1024 * 1014 * 2; // 2MB
  static mime_types = ['image/jpeg', 'image/png', 'image/gif'];

  constructor({ name, location }: { name: string; location: string }) {
    super({ name, location });
  }

  static createFromFile({
    raw_name,
    mime_type,
    size,
    video_id,
  }: {
    raw_name: string;
    mime_type: string;
    size: number;
    video_id: VideoId;
  }): ThumbnailHalf {
    const validator = new MediaFileValidator(
      ThumbnailHalf.max_size,
      ThumbnailHalf.mime_types,
    );
    const { name } = validator.validate({ raw_name, mime_type, size });

    return new ThumbnailHalf({
      name,
      location: `videos/${video_id.id}/images`,
    });
  }
}
