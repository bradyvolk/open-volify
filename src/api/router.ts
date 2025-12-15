import type { FastifyInstance } from "fastify";
import authController from "./controllers/authController.ts";

export default async function router(fastify: FastifyInstance) {
  fastify.register(authController, { prefix: "/api/auth" });
}
