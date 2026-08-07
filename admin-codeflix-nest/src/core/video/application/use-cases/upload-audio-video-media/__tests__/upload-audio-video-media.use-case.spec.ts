import EventEmitter2 from 'eventemitter2';
import { ApplicationService } from '../../../../../shared/application/aplication-service';
import { IMenssageBroker } from '../../../../../shared/application/menssage-broker.interface';
import { DomainEventMediator } from '../../../../../shared/domain/events/domain-event-mediator';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/sequelize/fake-unit-of-work-sequelise';
import { StorageInMemory } from '../../../../../shared/infra/storage/storage.in-memory';
import { PublishVideoMediaReplacedInQueueHandler } from '../../../handlers/publish-video-media-replaced-in-queue.handler';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../../../domain/domain-events/audio-video-media-replaced.event';
import { Video } from '../../../../domain/video.aggregate';
import { IVideoRepository } from '../../../../domain/video.repository';
import { UploadAudioVideoMediaUseCase } from '../upload-audio-video-media.use-case';

describe('UploadAudioVideoMediaUseCase', () => {
  it.each(['video', 'trailer'] as const)(
    'should publish VideoAudioMediaUploadedIntegrationEvent after uploading %s',
    async (field) => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const uow = new UnitOfWorkFakeInMemory();
      const eventMediator = new DomainEventMediator(new EventEmitter2());
      const applicationService = new ApplicationService(uow, eventMediator);
      const storage = new StorageInMemory();
      const publishEventMock = jest.fn().mockResolvedValue(undefined);
      const updateMock = jest.fn().mockImplementation(async (entity: Video) => {
        uow.addAggregateRoot(entity);
      });
      const messageBroker: IMenssageBroker = {
        publishEvent: publishEventMock,
      };
      const handler = new PublishVideoMediaReplacedInQueueHandler(
        messageBroker,
      );
      const videoRepo = {
        getById: jest.fn().mockResolvedValue(video),
        update: updateMock,
      } as unknown as IVideoRepository;

      eventMediator.register(
        VideoAudioMediaUploadedIntegrationEvent.name,
        handler.handle.bind(handler),
      );

      const useCase = new UploadAudioVideoMediaUseCase(
        applicationService,
        videoRepo,
        storage,
      );

      await useCase.execute({
        video_id: video.video_id.id,
        field,
        file: {
          raw_name: `${field}.mp4`,
          data: Buffer.from('video-content'),
          mime_type: 'video/mp4',
          size: 13,
        },
      });

      expect(updateMock).toHaveBeenCalledWith(video);
      expect(publishEventMock).toHaveBeenCalledTimes(1);

      const event = publishEventMock.mock
        .calls[0][0] as VideoAudioMediaUploadedIntegrationEvent;
      const media = field === 'video' ? video.video! : video.trailer!;

      expect(event).toBeInstanceOf(VideoAudioMediaUploadedIntegrationEvent);
      expect(event.event_name).toBe(
        VideoAudioMediaUploadedIntegrationEvent.name,
      );
      expect(event.payload).toEqual({
        video_id: video.video_id.id,
        media_type: field,
        resource_id: `${video.video_id.id}.${field}`,
        file_path: media.url,
        media: {
          ...media.toJSON(),
          status: media.status,
        },
      });
      await expect(storage.get(event.payload.file_path)).resolves.toMatchObject(
        {
          data: Buffer.from('video-content'),
          name: event.payload.file_path,
          mime_type: 'video/mp4',
        },
      );
      expect(video.events.size).toBe(0);
      expect(uow.getAggregateRoots()).toHaveLength(0);
    },
  );
});
