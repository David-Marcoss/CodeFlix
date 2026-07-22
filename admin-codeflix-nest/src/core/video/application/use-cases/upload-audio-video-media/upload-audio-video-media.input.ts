import {
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadAudioVideoMediaInputConstructorProps = {
  video_id: string;
  file: FileMediaInput;
  field: 'video' | 'trailer';
};

export class UploadAudioVideoMediaInput {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  video_id!: string;

  @IsIn(['video', 'trailer'])
  @IsNotEmpty()
  field!: 'video' | 'trailer';

  @ValidateNested()
  file!: FileMediaInput;

  constructor(props?: UploadAudioVideoMediaInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.file = props.file;
    this.field = props.field;
  }
}

export class ValidateUploadAudioVideoMediaInput {
  static validate(input: UploadAudioVideoMediaInput) {
    return validateSync(input);
  }
}
