import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { authenticate, can } from "../../lib/auth-middleware"
import {
  listContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/peopleController"

const ContactRoleSchema = z.enum(["volunteer", "staff", "admin"])

const CreateContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  pronouns: z.string().optional(),
  role: ContactRoleSchema,
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

const UpdateContactSchema = CreateContactSchema.partial()

const ContactQuerySchema = z.object({
  search: z.string().optional(),
  role: ContactRoleSchema.optional(),
})

export default async function peopleRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [authenticate, can({ contact: ["read"] })],
    async handler(request, reply) {
      const query = ContactQuerySchema.parse(request.query)
      return listContacts(query)
    },
  })

  fastify.post("/", {
    preHandler: [authenticate, can({ contact: ["create"] })],
    async handler(request, reply) {
      const body = CreateContactSchema.parse(request.body)
      const result = await createContact(body)
      return reply.status(201).send(result)
    },
  })

  fastify.get("/:id", {
    preHandler: [authenticate, can({ contact: ["read"] })],
    async handler(request, reply) {
      const { id } = request.params as { id: string }
      const result = await getContactById(id)
      if (!result) return reply.status(404).send({ error: "Contact not found" })
      return result
    },
  })

  fastify.patch("/:id", {
    preHandler: [authenticate, can({ contact: ["update"] })],
    async handler(request, reply) {
      const { id } = request.params as { id: string }
      const body = UpdateContactSchema.parse(request.body)
      const result = await updateContact(id, body)
      if (!result) return reply.status(404).send({ error: "Contact not found" })
      return result
    },
  })

  fastify.delete("/:id", {
    preHandler: [authenticate, can({ contact: ["delete"] })],
    async handler(request, reply) {
      const { id } = request.params as { id: string }
      await deleteContact(id)
      return reply.status(204).send()
    },
  })
}
