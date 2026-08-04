import { OnEvent } from '@nestjs/event-emitter';
import { IIntegrationEventHandler } from '../../../shared/application/IDomainEventHandler';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../domain/domain-events/audio-video-media-replaced.event';

export class PublishVideoMediaReplacedInQueueHandler implements IIntegrationEventHandler {
  // Faz o processamento de um evento
  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    console.log(event);
  }
}
