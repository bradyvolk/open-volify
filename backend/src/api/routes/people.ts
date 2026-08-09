import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { httpErrors } from "@fastify/sensible";
import { authenticate, can } from "../../lib/auth-middleware";
import {
  CreateContactSchema,
  UpdateContactSchema,
  ContactQuerySchema,
  ContactParamsSchema,
  ContactResponseSchema,
} from "@shared/schemas/contact";
import {
  listContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/peopleController";
import { z } from "zod";

export default async function peopleRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/",
    {
      preValidation: [authenticate, can({ contact: ["read"] })],
      schema: {
        querystring: ContactQuerySchema,
        response: { 200: z.array(ContactResponseSchema) },
      },
    },
    async (request) => {
      return listContacts(request.query);
    },
  );

  app.post(
    "/",
    {
      preValidation: [authenticate, can({ contact: ["create"] })],
      schema: {
        body: CreateContactSchema,
        response: { 201: ContactResponseSchema },
      },
    },
    async (request, reply) => {
      const result = await createContact(request.body);
      return reply.status(201).send(result);
    },
  );

  app.get(
    "/:id",
    {
      preValidation: [authenticate, can({ contact: ["read"] })],
      schema: {
        params: ContactParamsSchema,
        response: { 200: ContactResponseSchema },
      },
    },
    async (request) => {
      const result = await getContactById(request.params.id);
      if (!result) throw httpErrors.notFound("Contact not found");
      return result;
    },
  );

  app.patch(
    "/:id",
    {
      preValidation: [authenticate, can({ contact: ["update"] })],
      schema: {
        params: ContactParamsSchema,
        body: UpdateContactSchema,
        response: { 200: ContactResponseSchema },
      },
    },
    async (request) => {
      const result = await updateContact(request.params.id, request.body);
      if (!result) throw httpErrors.notFound("Contact not found");
      return result;
    },
  );

  app.delete(
    "/:id",
    {
      preValidation: [authenticate, can({ contact: ["delete"] })],
      schema: {
        params: ContactParamsSchema,
      },
    },
    async (request, reply) => {
      await deleteContact(request.params.id);
      return reply.status(204).send();
    },
  );
}
