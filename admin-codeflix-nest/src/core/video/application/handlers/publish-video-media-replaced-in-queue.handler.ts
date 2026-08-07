import { OnEvent } from '@nestjs/event-emitter';
import { IIntegrationEventHandler } from '../../../shared/application/IDomainEventHandler';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../domain/domain-events/audio-video-media-replaced.event';
import { IMenssageBroker } from '../../../shared/application/menssage-broker.interface';

export class PublishVideoMediaReplacedInQueueHandler implements IIntegrationEventHandler {
  constructor(readonly messageBroker: IMenssageBroker) {}

  // Faz o processamento de um evento
  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    await this.messageBroker.publishEvent(event);
  }
}
