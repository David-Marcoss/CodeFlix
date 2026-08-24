import {
  IDomainEvent,
  IIntegrationEvent,
} from '../../../shared/domain/events/domain-events.interface';
import { Trailer } from '../trailer.vo';
import { VideoMedia } from '../video-media.vo';
import { VideoId } from '../video.aggregate';
import { AudioVideoMediaStatus } from '../../../shared/domain/value-objects/audio-video-media.vo';

type VideoAudioMediaReplacedProps = {
  aggregate_id: VideoId;
  media: Trailer | VideoMedia;
  media_type: 'trailer' | 'video';
};

export class VideoAudioMediaReplaced implements IDomainEvent {
  aggregate_id: VideoId;
  occurred_on: Date;
  event_version: number;

  readonly media: Trailer | VideoMedia;
  readonly media_type: 'trailer' | 'video';

  constructor(props: VideoAudioMediaReplacedProps) {
    this.aggregate_id = props.aggregate_id;
    this.media = props.media;
    this.media_type = props.media_type;
    this.occurred_on = new Date();
    this.event_version = 1;
  }

  getIntegrationEvent(): VideoAudioMediaUploadedIntegrationEvent {
    return new VideoAudioMediaUploadedIntegrationEvent(this);
  }
}

type VideoAudioMediaUploadedPayload = {
  video_id: string;
  media_type: 'trailer' | 'video';
  resource_id: string;
  file_path: string;
  media: {
    name: string;
    raw_location: string;
    encoded_location: string | null;
    status: AudioVideoMediaStatus;
  };
};

export class VideoAudioMediaUploadedIntegrationEvent implements IIntegrationEvent<VideoAudioMediaUploadedPayload> {
  declare event_name: string;
  declare payload: VideoAudioMediaUploadedPayload;
  declare event_version: number;
  declare occurred_on: Date;

  constructor(event: VideoAudioMediaReplaced) {
    this['event_name'] = this.constructor.name;
    this['resource_id'] = `${event.aggregate_id.id}.${event.media_type}`;
    this['file_path'] = event.media.raw_location;
    this.event_version = event.event_version;
    this.occurred_on = event.occurred_on;
    this.payload = {
      video_id: event.aggregate_id.id,
      media_type: event.media_type,
      resource_id: `${event.aggregate_id.id}.${event.media_type}`,
      file_path: event.media.url,
      media: {
        ...event.media.toJSON(),
        status: event.media.status,
      },
    };
    this.event_name = this.constructor.name;
  }
}
