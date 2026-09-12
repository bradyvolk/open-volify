import { describe, it, expect } from "bun:test";
import {
  emailField,
  phoneField,
  zipField,
  stateField,
  nameField,
  shortTextField,
  optionalEmptyable,
} from "./fields";
import { z } from "zod";

describe("emailField", () => {
  it("accepts a valid email", () => {
    expect(emailField.parse("pat@example.com")).toBe("pat@example.com");
  });

  it("rejects an invalid email", () => {
    expect(emailField.safeParse("not-an-email").success).toBe(false);
  });

  it("rejects an email over 254 characters", () => {
    const long = `${"a".repeat(250)}@x.com`;
    expect(emailField.safeParse(long).success).toBe(false);
  });
});

describe("phoneField", () => {
  it("normalizes a formatted 10-digit number to E.164", () => {
    expect(phoneField.parse("(555) 123-4567")).toBe("+15551234567");
  });

  it("normalizes a number with a leading country code", () => {
    expect(phoneField.parse("+1 555.123.4567")).toBe("+15551234567");
  });

  it("normalizes a bare 10-digit number", () => {
    expect(phoneField.parse("5551234567")).toBe("+15551234567");
  });

  it("rejects a number that is too short", () => {
    expect(phoneField.safeParse("12345").success).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(phoneField.safeParse("not-a-phone").success).toBe(false);
  });
});

describe("zipField", () => {
  it("accepts a 5-digit zip", () => {
    expect(zipField.parse("94103")).toBe("94103");
  });

  it("accepts a ZIP+4", () => {
    expect(zipField.parse("94103-1234")).toBe("94103-1234");
  });

  it("rejects a malformed zip", () => {
    expect(zipField.safeParse("941").success).toBe(false);
  });
});

describe("stateField", () => {
  it("accepts and uppercases a valid state code", () => {
    expect(stateField.parse("ca")).toBe("CA");
  });

  it("rejects an invalid state code", () => {
    expect(stateField.safeParse("ZZ").success).toBe(false);
  });
});

describe("nameField", () => {
  it("trims whitespace", () => {
    expect(nameField.parse("  Pat  ")).toBe("Pat");
  });

  it("rejects an empty string", () => {
    expect(nameField.safeParse("").success).toBe(false);
  });

  it("rejects a string over 100 characters", () => {
    expect(nameField.safeParse("a".repeat(101)).success).toBe(false);
  });
});

describe("shortTextField", () => {
  it("enforces the given max length", () => {
    const field = shortTextField(5);
    expect(field.parse("abcde")).toBe("abcde");
    expect(field.safeParse("abcdef").success).toBe(false);
  });
});

describe("optionalEmptyable", () => {
  const schema = z.object({ email: optionalEmptyable(emailField) });

  it("normalizes an empty string to null", () => {
    expect(schema.parse({ email: "" })).toEqual({ email: null });
  });

  it("leaves an omitted key omitted", () => {
    expect(schema.parse({})).toEqual({});
  });

  it("validates a present value", () => {
    expect(schema.parse({ email: "pat@example.com" })).toEqual({ email: "pat@example.com" });
  });

  it("rejects an invalid present value", () => {
    expect(schema.safeParse({ email: "nope" }).success).toBe(false);
  });
});
