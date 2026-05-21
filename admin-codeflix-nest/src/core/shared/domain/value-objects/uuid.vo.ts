import { ValueObject } from '../value-object';
import { randomUUID } from 'crypto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Uuid extends ValueObject {
  id: string;
  constructor(value?: string) {
    super();
    this.id = value || randomUUID();
    this.validate();
  }

  private validate() {
    if (!UUID_REGEX.test(this.id)) {
      throw new UuidValidationError();
    }
  }

  toString() {
    return this.id;
  }
}

export class UuidValidationError extends Error {
  constructor(message?: string) {
    super(message || 'Value must be a valid UUID');
    this.name = 'UuidValidationError';
  }
}
