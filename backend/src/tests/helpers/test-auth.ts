import { eq } from "drizzle-orm"
import { hashPassword } from "better-auth/crypto"
import type { FastifyInstance } from "fastify"
import db from "../../db/db"
import { user, account } from "../../db/schema/auth-schema"

export const TEST_PASSWORD = "Test-Password-123!"

export type TestRole = "volunteer" | "staff" | "admin"

export async function createTestUser(role: TestRole) {
  const id = crypto.randomUUID()
  const email = `test-${crypto.randomUUID()}@example.com`
  const now = new Date()

  const [createdUser] = await db
    .insert(user)
    .values({
      id,
      name: `Test ${role}`,
      email,
      emailVerified: true,
      role,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
  if (!createdUser) throw new Error("Failed to create test user")

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: await hashPassword(TEST_PASSWORD),
    createdAt: now,
    updatedAt: now,
  })

  return createdUser
}

export async function signInTestUser(
  server: FastifyInstance,
  email: string,
): Promise<Record<string, string>> {
  const response = await server.inject({
    method: "POST",
    url: "/api/auth/sign-in/email",
    payload: { email, password: TEST_PASSWORD },
  })

  const sessionCookie = response.cookies.find((cookie) =>
    cookie.name.endsWith("session_token"),
  )
  if (!sessionCookie) {
    throw new Error(`Sign-in failed for ${email}: ${response.body}`)
  }

  return { [sessionCookie.name]: sessionCookie.value }
}

export async function createAuthedUser(server: FastifyInstance, role: TestRole) {
  const testUser = await createTestUser(role)
  const cookies = await signInTestUser(server, testUser.email)
  return { user: testUser, cookies }
}

export async function deleteTestUser(userId: string): Promise<void> {
  await db.delete(user).where(eq(user.id, userId))
}
