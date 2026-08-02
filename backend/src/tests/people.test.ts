import { describe, it, expect, beforeEach } from "bun:test"
import { eq, or } from "drizzle-orm"
import db from "../db/db"
import { contact } from "../db/schema/contact-schema"
import {
  listContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../api/controllers/peopleController"
import { ConflictError } from "../lib/errors"

const TEST_EMAIL = "test-contact@example.com"
const OTHER_EMAIL = "other-contact@example.com"

async function cleanup() {
  await db.delete(contact).where(or(eq(contact.email, TEST_EMAIL), eq(contact.email, OTHER_EMAIL)))
}

describe("peopleController", () => {
  beforeEach(cleanup)

  describe("createContact", () => {
    it("creates a contact and returns it", async () => {
      const result = await createContact({
        firstName: "Jane",
        lastName: "Doe",
        email: TEST_EMAIL,
        role: "volunteer",
      })
      expect(result.firstName).toBe("Jane")
      expect(result.lastName).toBe("Doe")
      expect(result.email).toBe(TEST_EMAIL)
      expect(result.role).toBe("volunteer")
      expect(result.id).toBeDefined()
    })
  })

  describe("createContact - duplicate email", () => {
    it("throws ConflictError when email already exists", async () => {
      await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })

      let caught: unknown
      try {
        await createContact({ firstName: "Jane2", lastName: "Doe2", email: TEST_EMAIL, role: "volunteer" })
      } catch (error) {
        caught = error
      }

      expect(caught).toBeInstanceOf(ConflictError)
    })
  })

  describe("listContacts", () => {
    it("returns contacts matching name search", async () => {
      await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      const results = await listContacts({ search: "Jane" })
      expect(results.some((c) => c.email === TEST_EMAIL)).toBe(true)
    })

    it("returns no contacts for non-matching search", async () => {
      await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      const results = await listContacts({ search: "ZzzNotExist" })
      expect(results.some((c) => c.email === TEST_EMAIL)).toBe(false)
    })

    it("filters by role", async () => {
      await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "staff" })
      const staffResults = await listContacts({ role: "staff" })
      expect(staffResults.some((c) => c.email === TEST_EMAIL)).toBe(true)
      const volunteerResults = await listContacts({ role: "volunteer" })
      expect(volunteerResults.some((c) => c.email === TEST_EMAIL)).toBe(false)
    })
  })

  describe("getContactById", () => {
    it("returns a contact by id", async () => {
      const created = await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      const result = await getContactById(created.id)
      expect(result?.id).toBe(created.id)
    })

    it("returns undefined for unknown id", async () => {
      const result = await getContactById("nonexistent-id")
      expect(result).toBeUndefined()
    })
  })

  describe("updateContact", () => {
    it("updates a contact field", async () => {
      const created = await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      const result = await updateContact(created.id, { firstName: "Updated" })
      expect(result?.firstName).toBe("Updated")
    })

    it("throws ConflictError when updating to an email already in use", async () => {
      const other = await createContact({
        firstName: "Other",
        lastName: "Person",
        email: OTHER_EMAIL,
        role: "volunteer",
      })
      const created = await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })

      let caught: unknown
      try {
        await updateContact(created.id, { email: other.email })
      } catch (error) {
        caught = error
      }

      expect(caught).toBeInstanceOf(ConflictError)
    })
  })

  describe("deleteContact", () => {
    it("deletes a contact", async () => {
      const created = await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      const resultBeforeDelete = await getContactById(created.id)
      expect(resultBeforeDelete).toBeDefined()
      await deleteContact(created.id)
      const result = await getContactById(created.id)
      expect(result).toBeUndefined()
    })
  })
})
