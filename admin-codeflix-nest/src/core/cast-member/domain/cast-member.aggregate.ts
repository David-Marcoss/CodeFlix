import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './cast-member-type.vo';
import { CastMemberValidatorFactory } from './cast-member.validator';
import { CastMemberFakeBuilder } from './category-fake.builder';

export class CastMemberId extends Uuid {}

interface CreateCastMemberProps {
  cast_member_id?: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at?: Date;
}

export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at: Date;

  constructor(props: CreateCastMemberProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();

    this.validate();
  }

  static create(data: CreateCastMemberProps) {
    return new CastMember(data);
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  changeName(name: string) {
    this.name = name;

    this.validate();
  }

  changeType(type: CastMemberType) {
    this.type = type;
  }

  get entity_id(): ValueObject {
    return this.cast_member_id;
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  toJSON() {
    return {
      cast_member_id: this.cast_member_id,
      name: this.name,
      type: this.type,
      created_at: this.created_at,
    };
  }
}
