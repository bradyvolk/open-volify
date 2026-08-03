import type { FastifyInstance } from "fastify";
import authController from "./controllers/authController.ts";
import peopleRoutes from "./routes/people.ts";

export default async function router(fastify: FastifyInstance) {
  fastify.register(authController, { prefix: "/api/auth" });
  fastify.register(peopleRoutes, { prefix: "/api/people" });
}
