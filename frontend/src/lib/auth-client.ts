import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:3006", // Match the Fastify server port
});
