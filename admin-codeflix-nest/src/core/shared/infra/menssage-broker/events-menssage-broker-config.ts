import { VideoAudioMediaReplaced } from '../../../video/domain/domain-events/audio-video-media-replaced.event';

export const EVENT_MENSSAGE_BROKER_CONFIG = {
  [VideoAudioMediaReplaced.name]: {
    exchange: 'amq.direct',
    routing_key: VideoAudioMediaReplaced.name,
  },
  TestEvent: {
    exchange: 'test-exchange',
    routing_key: 'TestEvent',
  },
};
