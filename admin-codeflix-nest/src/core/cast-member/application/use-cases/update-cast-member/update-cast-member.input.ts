import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { CastMenberTypeEnum } from '../create-cast-member/create-cast-member.input';

export type UpdateCastMemberInputConstructorProps = {
  cast_member_id: string;
  name?: string;
  type?: 'actor' | 'director';
};

export class UpdateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  cast_member_id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(CastMenberTypeEnum)
  type?: CastMenberTypeEnum;

  constructor(props?: UpdateCastMemberInputConstructorProps) {
    if (!props) return;
    this.cast_member_id = props.cast_member_id;
    props.name && (this.name = props.name);
    props.type &&
      (this.type =
        props.type === 'actor'
          ? CastMenberTypeEnum.ACTOR
          : CastMenberTypeEnum.DIRECTOR);
  }
}

export class ValidateUpdateCastMemberInput {
  static validate(input: UpdateCastMemberInput) {
    return validateSync(input);
  }
}
