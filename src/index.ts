import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import router from "./api/router.ts";

const isProduction = process.env.NODE_ENV === "production";

// Fastify server
const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

// Setup CORS
server.register(cors, {
  origin: (origin, cb) => {
    // Allow requests without an origin
    if (!origin) {
      cb(null, true);
      return;
    }
    const hostname = new URL(origin ?? "").hostname;

    // Allow requests from localhost
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }

    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

// Setup static file serving
const staticDir = isProduction
  ? path.join(process.cwd(), "dist")
  : path.join(process.cwd(), "src");

await server.register(fastifyStatic, {
  root: staticDir,
  prefix: "/",
  index: "index.html",
});

// Register API routes
server.register(router);

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

server.listen({ port: FASTIFY_PORT });
