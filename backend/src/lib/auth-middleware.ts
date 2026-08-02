// backend/src/lib/auth-middleware.ts
import type { FastifyRequest, FastifyReply } from "fastify"
import type { User } from "better-auth"
import { auth } from "../auth"
import { ForbiddenError, UnauthorizedError } from "./errors"

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({ headers: request.headers as any })
  if (!session?.user) {
    throw new UnauthorizedError()
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
      throw new ForbiddenError()
    }
    if (!result.success) {
      throw new ForbiddenError()
    }
  }
