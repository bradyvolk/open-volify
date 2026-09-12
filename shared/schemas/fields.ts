import { z } from "zod";
import { US_STATE_CODES } from "./us-states";

export const emailField = z.email().max(254);

export const phoneField = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const digits = value.replace(/[\s().-]/g, "").replace(/^\+/, "");
    const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    if (!/^\d{10}$/.test(national)) {
      ctx.addIssue({ code: "custom", message: "Must be a valid 10-digit US phone number" });
      return z.NEVER;
    }
    return `+1${national}`;
  });

export const zipField = z.string().regex(/^\d{5}(-\d{4})?$/, "Must be a valid US zip code");

export const stateField = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => (US_STATE_CODES as readonly string[]).includes(value), {
    message: "Must be a valid US state or territory code",
  });

export const nameField = z.string().trim().min(1, "Name is required").max(100);

export function shortTextField(maxLength: number) {
  return z.string().trim().min(1).max(maxLength);
}

export function optionalEmptyable<T extends z.ZodType<string>>(schema: T) {
  return schema
    .or(z.literal(""))
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .optional();
}
