import { ValueObject } from '../../shared/domain/value-object';

type CastMemberTypeOptions = 'actor' | 'director';

export class CastMemberType extends ValueObject {
  type: CastMemberTypeOptions;
  constructor(value: CastMemberTypeOptions) {
    super();
    this.type = value;
    this.validate();
  }

  private validate() {
    if (this.type !== 'actor' && this.type !== 'director') {
      throw new CastMemberTypeError();
    }
  }

  toString() {
    return this.type;
  }
}

export class CastMemberTypeError extends Error {
  constructor(message?: string) {
    super(message || 'Value must be "actor" or "director"');
    this.name = 'CastMemberTypeError';
  }
}
