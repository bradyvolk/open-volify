import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import router from "./api/router";
import { getAdditionalAllowedHostnames } from "./lib/allowed-origins";
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

  // Setup CORS. Self-hosters on a custom domain can add origins via the
  // ADDITIONAL_ALLOWED_ORIGINS env var (see lib/allowed-origins.ts).
  const additionalHostnames = getAdditionalAllowedHostnames();
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const hostname = new URL(origin).hostname;
      // Allow localhost for development and CloudFront/API Gateway for production
      const allowed =
        hostname === "localhost" ||
        hostname.includes("cloudfront.net") ||
        hostname.includes("execute-api") ||
        hostname.includes("amazonaws.com") ||
        hostname.includes("open-volify.org") ||
        additionalHostnames.includes(hostname);
      cb(null, allowed);
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

const server = await buildServer();

await server.listen({
  port: Number(process.env.PORT) || 3006,
  host: "0.0.0.0",
});
