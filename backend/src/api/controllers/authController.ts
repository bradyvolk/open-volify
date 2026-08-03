import type { FastifyInstance } from "fastify";
import { auth } from "../../auth";

export default async function authController(fastify: FastifyInstance) {
  fastify.route({
    method: ["GET", "POST"],
    url: "/*",
    async handler(request, reply) {
      try {
        // Construct request URL - respect X-Forwarded-Proto for environments behind a proxy/CDN
        const proto =
          request.headers["x-forwarded-proto"] ||
          (process.env.NODE_ENV === "production" ? "https" : "http");
        const url = new URL(request.url, `${proto}://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        // Handle body - check if it's already a string or needs stringification
        let body: string | undefined;
        if (request.body) {
          body = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
        }

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body,
        });

        // Process authentication request
        const response = await auth.handler(req);

        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        console.error(error);
        fastify.log.error({ err: error }, "Authentication Error");
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });
}
