import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ProcessAudioVideoMediaInput } from '../../core/video/application/use-cases/process-audio-video-media/process-audio-video-media.input';
import { AudioVideoMediaStatus } from '../../core/shared/domain/value-objects/audio-video-media.vo';
import { Injectable, UseFilters, ValidationPipe } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { ProcessAudioVideoMediaUseCase } from '../../core/video/application/use-cases/process-audio-video-media/process-audio-video-media.use-case';
import { RabbitmqConsumeErrorFilter } from '../rabbitmq-module/rabbitmq-consumer-error/rabbitmq-consumer-error.filter';

@UseFilters(RabbitmqConsumeErrorFilter)
@Injectable()
export class VideoConsumer {
  constructor(private readonly moduleRef: ModuleRef) {}

  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: 'videos.convert',
    queue: 'micro-videos/admin',
    allowNonJsonMessages: true,
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'videos.convert',
    },
  })
  async onProcessVideo(msg: {
    video: {
      resource_id: string;
      encoded_video_folder: string;
      status: 'COMPLETED' | 'FAILED';
    };
  }) {
    const resource_id = msg.video?.resource_id
      ? `${msg.video?.resource_id}`
      : '';

    const [field, video_id] = resource_id.split('.');

    const dto = new ProcessAudioVideoMediaInput({
      video_id,
      field: field as 'video' | 'trailer',
      status: msg.video?.status as AudioVideoMediaStatus,
      encoded_location: msg.video?.encoded_video_folder,
    });

    const data = await new ValidationPipe({
      errorHttpStatusCode: 400,
    }).transform(dto, {
      metatype: ProcessAudioVideoMediaInput,
      type: 'body',
    });

    const contextId = ContextIdFactory.create();

    const useCase = await this.moduleRef.resolve(
      ProcessAudioVideoMediaUseCase,
      contextId,
    );

    await useCase.execute(data);
  }
}
