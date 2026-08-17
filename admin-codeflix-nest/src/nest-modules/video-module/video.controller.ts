import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Scope,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import 'multer';
import { CreateVideoDto } from './dto/create-video.dto';
import { CreateVideoUseCase } from '../../core/video/application/use-cases/create-video/create-video.use-case';
import { FindVideoUseCase } from '../../core/video/application/use-cases/find-video/find-video.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/use-cases/update-genre/update-genre.use-case';
import { UploadAudioVideoMediaUseCase } from '../../core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.use-case';
import { UploadImageMediaUseCase } from '../../core/video/application/use-cases/upload-image-media/upload-image-media.use-case';
import { UpdateVideoInput } from '../../core/video/application/use-cases/update-genre/update-video.input';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAudioVideoMediaInput } from '../../core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.input';
import { UploadImageMediaInput } from '../../core/video/application/use-cases/upload-image-media/upload-image-media.input';
import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';

@UseGuards(AuthGuard, CheckIsAdminGuard)
@Controller({ path: 'videos', scope: Scope.REQUEST })
export class VideoController {
  constructor(
    @Inject(CreateVideoUseCase)
    private readonly createUseCase: CreateVideoUseCase,
    @Inject(FindVideoUseCase)
    private readonly findUseCase: FindVideoUseCase,
    @Inject(UpdateVideoUseCase)
    private readonly updateUseCase: UpdateVideoUseCase,
    @Inject(UploadAudioVideoMediaUseCase)
    private readonly uploadAudioVideoMediaUseCase: UploadAudioVideoMediaUseCase,
    @Inject(UploadImageMediaUseCase)
    private readonly uploadImageMediaUseCase: UploadImageMediaUseCase,
  ) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.createUseCase.execute({ ...createVideoDto });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findUseCase.execute({ video_id: id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: any,
    @UploadedFiles()
    files: {
      banner: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
      thumbnail_half: Express.Multer.File[];
      video: Express.Multer.File[];
      trailer: Express.Multer.File[];
    },
  ) {
    const hasData = Object.keys(updateVideoDto).length > 0;
    const hasFile = files ? Object.keys(files).length > 0 : false;

    if (hasData && hasFile) {
      throw new BadRequestException(
        'Send data and files together is not allowed',
      );
    }

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 400,
      }).transform(
        { ...updateVideoDto, video_id: id },
        {
          metatype: UpdateVideoInput,
          type: 'body',
        },
      );

      const input = new UpdateVideoInput({ ...data, video_id: id });

      return this.updateUseCase.execute(input);
    }

    if (hasFile) {
      if (Object.keys(files).length > 1) {
        throw new BadRequestException(
          'Only one file may be uploaded at a time.',
        );
      }

      const isAudioVideoMedia = files.trailer?.length ?? files.video?.length;
      const field = Object.keys(files)[0];
      const file = files[field][0];

      if (isAudioVideoMedia) {
        const dto: UploadAudioVideoMediaInput = {
          video_id: id,
          field: field as any,
          file: {
            data: file.buffer,
            mime_type: file.mimetype,
            raw_name: file.originalname,
            size: file.size,
          },
        };

        const data = await new ValidationPipe({
          errorHttpStatusCode: 400,
        }).transform(dto, {
          metatype: UploadAudioVideoMediaInput,
          type: 'body',
        });

        const input = new UploadAudioVideoMediaInput(data);

        await this.uploadAudioVideoMediaUseCase.execute(input);
      } else {
        const dto: UploadImageMediaInput = {
          video_id: id,
          field: field as any,
          file: {
            data: file.buffer,
            mime_type: file.mimetype,
            raw_name: file.originalname,
            size: file.size,
          },
        };

        const data = await new ValidationPipe({
          errorHttpStatusCode: 400,
        }).transform(dto, {
          metatype: UploadImageMediaInput,
          type: 'body',
        });

        const input = new UploadImageMediaInput(data);

        await this.uploadImageMediaUseCase.execute(input);
      }
    }
  }
}
