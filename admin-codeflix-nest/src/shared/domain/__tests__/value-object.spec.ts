import { ValueObject } from "../value-object";

class CpfValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

describe("ValueObject tests", () => {
  test("should be equal", () => {
    const cpf1 = new CpfValueObject("12345678900");
    const cpf2 = new CpfValueObject("12345678900");

    expect(cpf1.equals(cpf2)).toBe(true);
  });

  test("should not be equal", () => {
    const cpf1 = new CpfValueObject("12345678900");
    const cpf2 = new CpfValueObject("09876543211");

    expect(cpf1.equals(cpf2)).toBe(false);
  });

  test("should not be equal when comparing with null", () => {
    const cpf1 = new CpfValueObject("12345678900");

    expect(cpf1.equals(null)).toBe(false);
  });

  test("should not be equal when comparing with undefined", () => {
    const cpf1 = new CpfValueObject("12345678900");

    expect(cpf1.equals(undefined)).toBe(false);
  });

  test("should not be equal when comparing with different type", () => {
    const cpf1 = new CpfValueObject("12345678900");
    const other = { value: "12345678900" };

    expect(cpf1.equals(other as any)).toBe(false);
  });
});
