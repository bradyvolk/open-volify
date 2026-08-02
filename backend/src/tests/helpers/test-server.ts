import type { FastifyInstance } from "fastify"
import { buildServer } from "../../server"

export async function buildTestServer(): Promise<FastifyInstance> {
  const server = await buildServer()
  await server.ready()
  return server
}
