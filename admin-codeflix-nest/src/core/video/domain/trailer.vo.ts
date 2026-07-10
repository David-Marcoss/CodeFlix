import { MediaFileValidator } from '../../shared/domain/validators/media-file-validator';
import {
  AudioVideoMedia,
  AudioVideoMediaStatus,
} from '../../shared/domain/value-objects/audio-video-media.vo';

import { VideoId } from './video.aggregate';

export class Trailer extends AudioVideoMedia {
  static max_size = 1024 * 1014 * 500; // 500MB
  static mime_types = ['video/mp4'];

  constructor({
    name,
    raw_location,
    status,
    encoded_location,
  }: {
    name: string;
    raw_location: string;
    encoded_location?: string;

    status: AudioVideoMediaStatus;
  }) {
    super({
      name,
      raw_location,
      encoded_location,
      status,
    });
  }

  static createFromFile({
    raw_name,
    mime_type,
    size,
    video_id,
    status = AudioVideoMediaStatus.PENDING,
  }: {
    raw_name: string;
    mime_type: string;
    size: number;
    video_id: VideoId;
    status?: AudioVideoMediaStatus;
  }): Trailer {
    const validator = new MediaFileValidator(
      Trailer.max_size,
      Trailer.mime_types,
    );
    const { name } = validator.validate({ raw_name, mime_type, size });

    return new Trailer({
      name,
      raw_location: `videos/${video_id.id}/videos`,
      status,
    });
  }

  static create({ name, raw_location }) {
    return new Trailer({
      name,
      raw_location,
      status: AudioVideoMediaStatus.PENDING,
    });
  }

  process() {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location!,
      status: AudioVideoMediaStatus.PROCESSING,
    });
  }

  complete(encoded_location: string) {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location,
      status: AudioVideoMediaStatus.COMPLETED,
    });
  }

  fail() {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location!,
      status: AudioVideoMediaStatus.FAILED,
    });
  }
}
