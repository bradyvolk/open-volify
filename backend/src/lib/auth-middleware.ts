// backend/src/lib/auth-middleware.ts
import type { FastifyRequest, FastifyReply } from "fastify"
import type { User } from "better-auth"
import createError from "http-errors"
import { auth } from "../auth"

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({ headers: request.headers as any })
  if (!session?.user) {
    throw createError(401)
  }
  request.user = session.user
}

export const can = (permission: Record<string, string[]>) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    let result: { success: boolean }
    try {
      result = await auth.api.userHasPermission({
        body: { userId: request.user.id, permissions: permission },
      })
    } catch {
      throw createError(403)
    }
    if (!result.success) {
      throw createError(403)
    }
  }
