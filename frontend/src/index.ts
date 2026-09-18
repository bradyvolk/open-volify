import { config } from "dotenv";
import path from "path";
import { serve } from "bun";
import index from "./index.html";

const isProduction = process.env.NODE_ENV === "production";

// Load backend/.env so FRONTEND_PORT and PORT are available — the frontend
// has no .env of its own, sharing the backend's for local dev.
if (!isProduction) config({ path: path.join(process.cwd(), "backend", ".env") });

const apiPort = Number(process.env.PORT) || 3006;

serve({
  port: Number(process.env.FRONTEND_PORT) || 3001,
  routes: {
    // In dev the API runs as its own process on its own port; proxy /api
    // through this server so the browser only ever talks to one origin,
    // matching production, where Fastify serves both from the same origin.
    "/api/*": (req: Request) => {
      if (isProduction) return new Response("Not Found", { status: 404 });
      const url = new URL(req.url);
      return fetch(`http://localhost:${apiPort}${url.pathname}${url.search}`, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        // @ts-expect-error - required by fetch when streaming a request body
        duplex: "half",
      });
    },
    "/*": index,
  },
});
