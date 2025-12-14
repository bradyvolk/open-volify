import type { FastifyInstance } from "fastify";
import userController from "./controllers/userController.ts";

export default async function router(fastify: FastifyInstance) {
  fastify.register(userController, { prefix: "/api/v1/users" });
}
