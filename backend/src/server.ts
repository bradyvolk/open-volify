import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import router from "./api/router";
import { getAllowedOrigins } from "./lib/allowed-origins";
import type { FastifyInstance } from "fastify";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Build the server
 * @returns {Promise<FastifyInstance>} The server instance
 */
export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: process.env.NODE_ENV !== "development",
  });

  // Setup CORS
  const allowedOrigins = new Set(getAllowedOrigins());
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      cb(null, allowedOrigins.has(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
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
