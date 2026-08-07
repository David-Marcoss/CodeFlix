import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { VideoAudioMediaUploadedIntegrationEvent } from './src/core/video/domain/domain-events/audio-video-media-replaced.event';

@Injectable()
export class RabbitMQFakeConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    queue: 'fake-queue',
    routingKey: VideoAudioMediaUploadedIntegrationEvent.name,
  })
  handle(msg) {
    console.log(msg);
  }
}
