import { VideoAudioMediaUploadedIntegrationEvent } from '../../../video/domain/domain-events/audio-video-media-replaced.event';

export const EVENT_MENSSAGE_BROKER_CONFIG = {
  [VideoAudioMediaUploadedIntegrationEvent.name]: {
    exchange: 'amq.direct',
    routing_key: VideoAudioMediaUploadedIntegrationEvent.name,
  },
  TestEvent: {
    exchange: 'test-exchange',
    routing_key: 'TestEvent',
  },
};
