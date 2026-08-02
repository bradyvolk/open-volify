import { describe, it, expect, beforeAll, afterAll, afterEach } from "bun:test"
import type { FastifyInstance } from "fastify"
import { buildTestServer } from "../helpers/test-server"
import { createAuthedUser, deleteTestUser } from "../helpers/test-auth"

describe("People routes", () => {
  let server: FastifyInstance
  const createdContactIds: string[] = []
  const createdUserIds: string[] = []

  beforeAll(async () => {
    server = await buildTestServer()
  })

  afterEach(async () => {
    while (createdContactIds.length > 0) {
      const id = createdContactIds.pop()!
      await server.inject({
        method: "DELETE",
        url: `/api/people/${id}`,
        cookies: (await createAdmin()).cookies,
      })
    }
  })

  afterAll(async () => {
    while (createdUserIds.length > 0) {
      await deleteTestUser(createdUserIds.pop()!)
    }
    await server.close()
  })

  async function createAdmin() {
    const authed = await createAuthedUser(server, "admin")
    createdUserIds.push(authed.user.id)
    return authed
  }

  async function createVolunteer() {
    const authed = await createAuthedUser(server, "volunteer")
    createdUserIds.push(authed.user.id)
    return authed
  }

  async function createStaff() {
    const authed = await createAuthedUser(server, "staff")
    createdUserIds.push(authed.user.id)
    return authed
  }

  describe("without a session", () => {
    it("returns 401 for every route", async () => {
      const list = await server.inject({ method: "GET", url: "/api/people" })
      expect(list.statusCode).toBe(401)

      const create = await server.inject({
        method: "POST",
        url: "/api/people",
        payload: { firstName: "A", lastName: "B", role: "volunteer" },
      })
      expect(create.statusCode).toBe(401)

      const detail = await server.inject({ method: "GET", url: "/api/people/nonexistent" })
      expect(detail.statusCode).toBe(401)
    })
  })

  describe("permissions", () => {
    it("forbids a volunteer from creating a contact", async () => {
      const { cookies } = await createVolunteer()
      const firstName = `NoCreate-${crypto.randomUUID()}`
      const response = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName, lastName: "B", role: "volunteer" },
      })
      expect(response.statusCode).toBe(403)

      const admin = await createAdmin()
      const list = await server.inject({
        method: "GET",
        url: "/api/people",
        cookies: admin.cookies,
      })
      expect(list.json().some((c: { firstName: string }) => c.firstName === firstName)).toBe(
        false,
      )
    })

    it("forbids staff from deleting a contact", async () => {
      const admin = await createAdmin()
      const created = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies: admin.cookies,
        payload: { firstName: "A", lastName: "B", role: "volunteer" },
      })
      const contactId = created.json().id
      createdContactIds.push(contactId)

      const staffUser = await createStaff()
      const response = await server.inject({
        method: "DELETE",
        url: `/api/people/${contactId}`,
        cookies: staffUser.cookies,
      })
      expect(response.statusCode).toBe(403)

      const stillThere = await server.inject({
        method: "GET",
        url: `/api/people/${contactId}`,
        cookies: admin.cookies,
      })
      expect(stillThere.statusCode).toBe(200)
    })

    it("allows a volunteer to read contacts", async () => {
      const { cookies } = await createVolunteer()
      const response = await server.inject({ method: "GET", url: "/api/people", cookies })
      expect(response.statusCode).toBe(200)
    })
  })

  describe("validation", () => {
    it("returns 400 when required fields are missing", async () => {
      const { cookies } = await createAdmin()
      const response = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName: "A" },
      })
      expect(response.statusCode).toBe(400)
    })

    it("returns 400 for an invalid email", async () => {
      const { cookies } = await createAdmin()
      const response = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName: "A", lastName: "B", role: "volunteer", email: "not-an-email" },
      })
      expect(response.statusCode).toBe(400)
    })
  })

  describe("duplicate email", () => {
    it("returns 409 when creating a contact with an email already in use", async () => {
      const { cookies } = await createAdmin()
      const email = `dupe-${crypto.randomUUID()}@example.com`

      const first = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName: "A", lastName: "B", role: "volunteer", email },
      })
      createdContactIds.push(first.json().id)

      const second = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName: "C", lastName: "D", role: "volunteer", email },
      })
      expect(second.statusCode).toBe(409)
    })
  })

  describe("CRUD happy path", () => {
    it("creates, reads, updates, and deletes a contact", async () => {
      const { cookies } = await createAdmin()

      const create = await server.inject({
        method: "POST",
        url: "/api/people",
        cookies,
        payload: { firstName: "Pat", lastName: "Lee", role: "volunteer" },
      })
      expect(create.statusCode).toBe(201)
      const contactRecord = create.json()
      expect(contactRecord.firstName).toBe("Pat")

      const read = await server.inject({
        method: "GET",
        url: `/api/people/${contactRecord.id}`,
        cookies,
      })
      expect(read.statusCode).toBe(200)
      expect(read.json().id).toBe(contactRecord.id)

      const update = await server.inject({
        method: "PATCH",
        url: `/api/people/${contactRecord.id}`,
        cookies,
        payload: { lastName: "Updated" },
      })
      expect(update.statusCode).toBe(200)
      expect(update.json().lastName).toBe("Updated")

      const del = await server.inject({
        method: "DELETE",
        url: `/api/people/${contactRecord.id}`,
        cookies,
      })
      expect(del.statusCode).toBe(204)

      const afterDelete = await server.inject({
        method: "GET",
        url: `/api/people/${contactRecord.id}`,
        cookies,
      })
      expect(afterDelete.statusCode).toBe(404)
    })
  })
})
