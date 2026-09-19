import { serve } from "bun";
import index from "./index.html";

const isProduction = process.env.NODE_ENV === "production";
const apiPort = Number(process.env.PORT) || 3006;

// Dev: `dev:frontend` loads backend/.env. /api is proxied to the backend so the
// browser only talks to one origin, as in production.
serve({
  port: Number(process.env.FRONTEND_PORT) || 3001,
  routes: {
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
