import { and, eq, sql } from "drizzle-orm";
import { httpErrors } from "@fastify/sensible";
import db from "../../db/db";
import { contact } from "../../db/schema/contact-schema";
import type { Contact } from "../../db/schema/contact-schema";
import type { CreateContactInput, ContactRole } from "@shared/schemas/contact";

function isUniqueConstraintViolation(error: unknown): boolean {
  const cause = (error as { cause?: { code?: unknown } } | null)?.cause;
  return cause?.code === "23505";
}

export async function listContacts(filters: {
  search?: string;
  role?: ContactRole;
}): Promise<Contact[]> {
  const where = and(
    filters.search
      ? sql`(${contact.firstName} || ' ' || ${contact.lastName}) ilike ${"%" + filters.search + "%"}`
      : undefined,
    filters.role ? eq(contact.role, filters.role) : undefined,
  );
  return db.select().from(contact).where(where);
}

export async function createContact(data: CreateContactInput): Promise<Contact> {
  try {
    const [result] = await db
      .insert(contact)
      .values({ id: crypto.randomUUID(), ...data })
      .returning();
    if (!result) throw new Error("Failed to create contact");
    return result;
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw httpErrors.conflict("A contact with this email already exists");
    }
    throw error;
  }
}

export async function getContactById(id: string): Promise<Contact | undefined> {
  const [result] = await db.select().from(contact).where(eq(contact.id, id));
  return result;
}

export async function updateContact(
  id: string,
  data: Partial<CreateContactInput>,
): Promise<Contact | undefined> {
  try {
    const [result] = await db.update(contact).set(data).where(eq(contact.id, id)).returning();
    return result;
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw httpErrors.conflict("A contact with this email already exists");
    }
    throw error;
  }
}

export async function deleteContact(id: string): Promise<void> {
  await db.delete(contact).where(eq(contact.id, id));
}
