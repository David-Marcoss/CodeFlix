import {
  Equals,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsArray,
  IsUUID,
  Min,
  IsInt,
  validateSync,
  IsOptional,
} from 'class-validator';
import { RatingValues } from '../../../domain/rating.vo';

export type UpdateVideoInputConstructorProps = {
  video_id: string;
  banner?: null;
  thumbnail?: null;
  thumbnail_half?: null;
  video?: null;
  trailer?: null;
  title?: string;
  description?: string;
  year_launched?: number;
  duration?: number;
  rating?: RatingValues;
  is_opened?: boolean;
  categories_id?: string[];
  genres_id?: string[];
  cast_members_id?: string[];
  is_active?: boolean;
};

export class UpdateVideoInput {
  @IsUUID()
  @IsNotEmpty()
  video_id!: string;

  @IsOptional()
  @Equals(null)
  banner?: null;

  @IsOptional()
  @Equals(null)
  thumbnail?: null;

  @IsOptional()
  @Equals(null)
  thumbnail_half?: null;

  @IsOptional()
  @Equals(null)
  video?: null;

  @IsOptional()
  @Equals(null)
  trailer?: null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @Min(1900)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  year_launched?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rating?: RatingValues;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  is_opened?: boolean;

  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  categories_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  genres_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  cast_members_id?: string[];

  constructor(props?: UpdateVideoInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.banner = props.banner;
    this.thumbnail = props.thumbnail;
    this.thumbnail_half = props.thumbnail_half;
    this.video = props.video;
    this.trailer = props.trailer;
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;
    this.rating = props.rating;
    this.is_opened = props.is_opened;
    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
  }
}

export class ValidateUpdateVideoInput {
  static validate(input: UpdateVideoInput) {
    return validateSync(input);
  }
}
