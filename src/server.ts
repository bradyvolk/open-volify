import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import router from "./api/router";
import type { FastifyInstance } from "fastify";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Build the server
 * @returns {Promise<FastifyInstance>} The server instance
 */
async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: process.env.NODE_ENV !== "development",
  });

  // Setup CORS
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const hostname = new URL(origin).hostname;
      cb(null, hostname === "localhost");
    },
  });

  const staticDir = isProduction
    ? path.join(process.cwd(), "dist")
    : path.join(process.cwd(), "src");

  await server.register(fastifyStatic, {
    root: staticDir,
    prefix: "/",
    index: "index.html",
  });

  server.setNotFoundHandler((req, reply) => {
    reply.sendFile("index.html");
  });

  // Register API routes
  await server.register(router);

  return server;
}

const server = await buildServer();

await server.listen({
  port: Number(process.env.FASTIFY_PORT) || 3006,
});
