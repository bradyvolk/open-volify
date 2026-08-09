import { z } from "zod";
import {
  emailField,
  phoneField,
  zipField,
  stateField,
  nameField,
  shortTextField,
  optionalEmptyable,
} from "./fields";

export const ContactRoleSchema = z.enum(["volunteer", "staff", "admin"]);

export const CreateContactSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: optionalEmptyable(emailField),
  phone: optionalEmptyable(phoneField),
  pronouns: optionalEmptyable(shortTextField(50)),
  role: ContactRoleSchema,
  addressLine1: optionalEmptyable(shortTextField(200)),
  addressLine2: optionalEmptyable(shortTextField(200)),
  city: optionalEmptyable(shortTextField(100)),
  state: optionalEmptyable(stateField),
  postalCode: optionalEmptyable(zipField),
  country: optionalEmptyable(shortTextField(100)),
});

export const UpdateContactSchema = CreateContactSchema.partial();

export const ContactQuerySchema = z.object({
  search: shortTextField(200).optional(),
  role: ContactRoleSchema.optional(),
});

export const ContactParamsSchema = z.object({
  id: z.uuid(),
});

export const ContactResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  pronouns: z.string().nullable(),
  role: ContactRoleSchema,
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postalCode: z.string().nullable(),
  country: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ContactRole = z.infer<typeof ContactRoleSchema>;
export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type ContactQuery = z.infer<typeof ContactQuerySchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;
