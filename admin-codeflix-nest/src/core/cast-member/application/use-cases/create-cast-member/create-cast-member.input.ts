import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';

export enum CastMenberTypeEnum {
  ACTOR = 'actor',
  DIRECTOR = 'director',
}

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: 'actor' | 'director';
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(CastMenberTypeEnum)
  type!: CastMenberTypeEnum;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type =
      props.type === 'actor'
        ? CastMenberTypeEnum.ACTOR
        : CastMenberTypeEnum.DIRECTOR;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
