import { Uuid, UuidValidationError } from "../uuid.vo";

describe("Uuid tests", () => {
  const validateSpyOn = jest.spyOn(Uuid.prototype as any, "validate");

  test("should create a valid UUID", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuid.id).toHaveLength(36);
    expect(validateSpyOn).toHaveBeenCalledTimes(1);
  });

  test("should create a valid UUID with provided value", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
    expect(validateSpyOn).toHaveBeenCalledTimes(1);
  });

  test("should throw an error for invalid UUID", () => {
    const invalidUuid = "invalid-uuid";
    expect(() => new Uuid(invalidUuid)).toThrow(new UuidValidationError());
    expect(validateSpyOn).toHaveBeenCalledTimes(1);
  });
});
