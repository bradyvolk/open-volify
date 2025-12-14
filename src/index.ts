import { serve } from "bun";
import index from "./index.html";
import fastify from "fastify";
import cors from "@fastify/cors";
import router from "./api/router.ts";

// Bun HTML server
serve({
  routes: {
    "/*": index,
  },
});

// Fastify API
const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

await server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin ?? "").hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

server.register(router);

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

server.listen({ port: FASTIFY_PORT });
