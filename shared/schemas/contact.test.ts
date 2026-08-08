import { describe, it, expect } from "bun:test";
import {
  CreateContactSchema,
  UpdateContactSchema,
  ContactQuerySchema,
  ContactParamsSchema,
  ContactResponseSchema,
} from "./contact";

describe("CreateContactSchema", () => {
  const valid = {
    firstName: "Pat",
    lastName: "Lee",
    role: "volunteer",
  };

  it("accepts the minimal required fields", () => {
    expect(CreateContactSchema.parse(valid)).toMatchObject({
      firstName: "Pat",
      lastName: "Lee",
      role: "volunteer",
    });
  });

  it("rejects a missing firstName", () => {
    const { firstName: _firstName, ...rest } = valid;
    expect(CreateContactSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an invalid role", () => {
    expect(CreateContactSchema.safeParse({ ...valid, role: "superadmin" }).success).toBe(false);
  });

  it("normalizes an empty-string email to null", () => {
    expect(CreateContactSchema.parse({ ...valid, email: "" }).email).toBeNull();
  });

  it("normalizes and validates phone, zip, and state together", () => {
    const result = CreateContactSchema.parse({
      ...valid,
      phone: "(555) 123-4567",
      postalCode: "94103-1234",
      state: "ca",
    });
    expect(result.phone).toBe("+15551234567");
    expect(result.postalCode).toBe("94103-1234");
    expect(result.state).toBe("CA");
  });

  it("rejects an invalid zip", () => {
    expect(CreateContactSchema.safeParse({ ...valid, postalCode: "abc" }).success).toBe(false);
  });

  it("strips unknown keys", () => {
    const result = CreateContactSchema.parse({ ...valid, evil: "hack" });
    expect(result).not.toHaveProperty("evil");
  });
});

describe("UpdateContactSchema", () => {
  it("accepts an empty object", () => {
    expect(UpdateContactSchema.parse({})).toEqual({});
  });

  it("accepts a partial update", () => {
    expect(UpdateContactSchema.parse({ lastName: "Updated" })).toEqual({ lastName: "Updated" });
  });

  it("normalizes an empty-string field to null on partial update", () => {
    expect(UpdateContactSchema.parse({ email: "" })).toEqual({ email: null });
  });
});

describe("ContactQuerySchema", () => {
  it("accepts no filters", () => {
    expect(ContactQuerySchema.parse({})).toEqual({});
  });

  it("accepts search and role", () => {
    expect(ContactQuerySchema.parse({ search: "pat", role: "staff" })).toEqual({
      search: "pat",
      role: "staff",
    });
  });

  it("rejects an invalid role filter", () => {
    expect(ContactQuerySchema.safeParse({ role: "nope" }).success).toBe(false);
  });
});

describe("ContactParamsSchema", () => {
  it("accepts a valid uuid", () => {
    const id = crypto.randomUUID();
    expect(ContactParamsSchema.parse({ id })).toEqual({ id });
  });

  it("rejects a non-uuid id", () => {
    expect(ContactParamsSchema.safeParse({ id: "not-a-uuid" }).success).toBe(false);
  });
});

describe("ContactResponseSchema", () => {
  it("serializes a full contact record with ISO date strings", () => {
    const now = new Date();
    const record = {
      id: crypto.randomUUID(),
      firstName: "Pat",
      lastName: "Lee",
      email: null,
      phone: null,
      pronouns: null,
      role: "volunteer",
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      createdAt: now,
      updatedAt: now,
    };
    const result = ContactResponseSchema.parse(record);
    expect(result.createdAt).toBe(now.toISOString());
    expect(result.updatedAt).toBe(now.toISOString());
  });
});
