import { OnEvent } from '@nestjs/event-emitter';
import { IDomainEventHandler } from '../../../shared/application/IDomainEventHandler';
import { VideoAudioMediaReplaced } from '../../domain/domain-events/audio-video-media-replaced.event';

export class PublishVideoMediaReplacedInQueueHandler implements IDomainEventHandler {
  // Faz o processamento de um evento
  @OnEvent(VideoAudioMediaReplaced.name)
  async handle(event: VideoAudioMediaReplaced): Promise<void> {
    console.log(event);
  }
}
