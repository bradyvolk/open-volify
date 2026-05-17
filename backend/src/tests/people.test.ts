import { describe, it, expect, beforeEach } from "bun:test"
import { eq } from "drizzle-orm"
import db from "../db/db"
import { contact } from "../db/schema/contact-schema"
import {
  listContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../api/controllers/peopleController"

const TEST_EMAIL = "test-contact@example.com"

async function cleanup() {
  await db.delete(contact).where(eq(contact.email, TEST_EMAIL))
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
  })

  describe("deleteContact", () => {
    it("deletes a contact", async () => {
      const created = await createContact({ firstName: "Jane", lastName: "Doe", email: TEST_EMAIL, role: "volunteer" })
      await deleteContact(created.id)
      const result = await getContactById(created.id)
      expect(result).toBeUndefined()
    })
  })
})
