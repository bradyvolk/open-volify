// backend/src/lib/auth-middleware.ts
import type { FastifyRequest, FastifyReply } from "fastify"
import type { User } from "better-auth"
import { httpErrors } from "@fastify/sensible"
import { auth } from "../auth"

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({ headers: request.headers as any })
  if (!session?.user) {
    throw httpErrors.unauthorized()
  }
  request.user = session.user
}

export const can = (permission: Record<string, string[]>) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await auth.api
      .userHasPermission({
        body: { userId: request.user.id, permissions: permission },
      })
      .catch(() => ({ success: false }))
    if (!result.success) {
      throw httpErrors.forbidden()
    }
  }
