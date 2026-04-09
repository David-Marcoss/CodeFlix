import { ValueObject } from "../value-object";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class Uuid extends ValueObject {
  id;
  constructor(readonly value?: string) {
    super();
    this.id = value || uuidv4();
    this.validate();
  }

  private validate() {
    if (!uuidValidate(this.id)) {
      throw new UuidValidationError();
    }
  }
}

export class UuidValidationError extends Error {
  constructor(message?: string) {
    super(message || "Value must be a valid UUID");
    this.name = "UuidValidationError";
  }
}
