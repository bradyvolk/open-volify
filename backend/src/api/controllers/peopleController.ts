import { and, eq, sql } from "drizzle-orm"
import db from "../../db/db"
import { contact } from "../../db/schema/contact-schema"
import type { Contact } from "../../db/schema/contact-schema"
import { ConflictError } from "../../lib/errors"

type CreateContactInput = {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  pronouns?: string | null
  role: string
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
}

function isUniqueConstraintViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false

  const err = error as Record<string, unknown>

  // Direct check for postgres error code
  if (err.code === "23505") return true

  // Check nested cause (Drizzle wraps postgres errors)
  if (err.cause && typeof err.cause === "object") {
    const cause = err.cause as Record<string, unknown>
    if (cause.code === "23505") return true
  }

  return false
}

export async function listContacts(filters: {
  search?: string
  role?: string
}): Promise<Contact[]> {
  const where = and(
    filters.search
      ? sql`(${contact.firstName} || ' ' || ${contact.lastName}) ilike ${"%" + filters.search + "%"}`
      : undefined,
    filters.role ? eq(contact.role, filters.role) : undefined,
  )
  return db.select().from(contact).where(where)
}

export async function createContact(data: CreateContactInput): Promise<Contact> {
  try {
    const [result] = await db
      .insert(contact)
      .values({ id: crypto.randomUUID(), ...data })
      .returning()
    if (!result) throw new Error("Failed to create contact")
    return result
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new ConflictError("A contact with this email already exists")
    }
    throw error
  }
}

export async function getContactById(id: string): Promise<Contact | undefined> {
  const [result] = await db.select().from(contact).where(eq(contact.id, id))
  return result
}

export async function updateContact(
  id: string,
  data: Partial<CreateContactInput>,
): Promise<Contact | undefined> {
  try {
    const [result] = await db
      .update(contact)
      .set(data)
      .where(eq(contact.id, id))
      .returning()
    return result
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new ConflictError("A contact with this email already exists")
    }
    throw error
  }
}

export async function deleteContact(id: string): Promise<void> {
  await db.delete(contact).where(eq(contact.id, id))
}
