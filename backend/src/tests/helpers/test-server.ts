import type { FastifyInstance } from "fastify";
import { buildServer } from "../../server";

/** Builds the real, fully-wired Fastify app for use with `.inject()` in integration tests. */
export async function buildTestServer(): Promise<FastifyInstance> {
  const server = await buildServer();
  await server.ready();
  return server;
}
