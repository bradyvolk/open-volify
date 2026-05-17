// backend/src/lib/auth-middleware.ts
import type { FastifyRequest, FastifyReply } from "fastify"
import type { User } from "better-auth"
import { auth } from "../auth"

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({ headers: request.headers as any })
  if (!session?.user) {
    return reply.status(401).send({ error: "Unauthorized" })
  }
  request.user = session.user
}

export const can = (permission: Record<string, string[]>) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await auth.api.userHasPermission({
        body: { userId: request.user.id, permissions: permission },
      })
      if (!result.success) {
        return reply.status(403).send({ error: "Forbidden" })
      }
    } catch {
      return reply.status(403).send({ error: "Forbidden" })
    }
  }
