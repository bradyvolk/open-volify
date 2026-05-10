import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import router from "./api/router";
import type { FastifyInstance } from "fastify";

const isProduction = process.env.NODE_ENV === "production";
const isLambda = !!process.env.LAMBDA_TASK_ROOT;

/**
 * Build the server
 * @returns {Promise<FastifyInstance>} The server instance
 */
export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: process.env.NODE_ENV !== "development",
  });

  // Setup CORS
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
        hostname.includes("open-volify.org");
      cb(null, allowed);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

// Only start the server if not running in Lambda
if (!isLambda) {
  const server = await buildServer();

  await server.listen({
    port: Number(process.env.PORT) || 3006,
    host: "0.0.0.0",
  });
}
