import {
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
  IsIn,
} from 'class-validator';
import { AudioVideoMediaStatus } from '../../../../shared/domain/value-objects/audio-video-media.vo';

export type ProcessAudioVideoMediaInputConstructorProps = {
  video_id: string;
  field: 'video' | 'trailer';
  status: AudioVideoMediaStatus;
  encoded_location: string;
};

export class ProcessAudioVideoMediaInput {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  video_id!: string;

  @IsIn(['video', 'trailer'])
  @IsNotEmpty()
  field!: 'video' | 'trailer';

  @IsIn([AudioVideoMediaStatus.COMPLETED, AudioVideoMediaStatus.FAILED])
  @IsNotEmpty()
  status!: AudioVideoMediaStatus;

  @IsString()
  @IsNotEmpty()
  encoded_location!: string;

  constructor(props?: ProcessAudioVideoMediaInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.status = props.status;
    this.encoded_location = props.encoded_location;
    this.field = props.field;
  }
}

export class ValidateProcessAudioVideoMediaInput {
  static validate(input: ProcessAudioVideoMediaInput) {
    return validateSync(input);
  }
}
