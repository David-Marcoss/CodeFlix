import {
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadImageMediaInputConstructorProps = {
  video_id: string;
  file: FileMediaInput;
  field: 'banner' | 'thumbnail' | 'thumbnail_half';
};

export class UploadImageMediaInput {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  video_id!: string;

  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field!: 'banner' | 'thumbnail' | 'thumbnail_half';

  @ValidateNested()
  file!: FileMediaInput;

  constructor(props?: UploadImageMediaInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.file = props.file;
    this.field = props.field;
  }
}

export class ValidateUploadImageMediaInput {
  static validate(input: UploadImageMediaInput) {
    return validateSync(input);
  }
}
