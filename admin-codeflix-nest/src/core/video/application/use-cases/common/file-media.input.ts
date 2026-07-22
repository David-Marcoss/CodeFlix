import {
  IsNotEmpty,
  IsString,
  IsInt,
  validateSync,
  IsInstance,
} from 'class-validator';

export type FileMediaInputConstructorProps = {
  raw_name: string;
  data: Buffer;
  size: number;
  mime_type: string;
};

export class FileMediaInput {
  @IsString()
  @IsNotEmpty()
  raw_name!: string;

  @IsInstance(Buffer)
  data!: Buffer;

  @IsInt()
  @IsNotEmpty()
  size!: number;

  @IsString()
  @IsNotEmpty()
  mime_type!: string;

  constructor(props?: FileMediaInputConstructorProps) {
    if (!props) return;
    this.raw_name = props.raw_name;
    this.mime_type = props.mime_type;
    this.data = props.data;
    this.size = props.size;
  }
}

export class ValidateFileMediaInput {
  static validate(input: FileMediaInput) {
    return validateSync(input);
  }
}
