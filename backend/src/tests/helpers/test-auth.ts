import { eq } from "drizzle-orm"
import { hashPassword } from "better-auth/crypto"
import type { FastifyInstance } from "fastify"
import type { UserRole } from "@shared/permissions"
import db from "../../db/db"
import { user, account } from "../../db/schema/auth-schema"

export const TEST_PASSWORD = "Test-Password-123!"

/**
 * Guards test-only helpers (seeding users, deleting users) from ever running against a
 * non-local DATABASE_URL, in case a test file is accidentally run with prod/staging env vars.
 */
function assertLocalDatabase(): void {
  const url = process.env.DATABASE_URL ?? ""
  const isLocal = /^(postgres:\/\/[^/]*@)?(localhost|127\.0\.0\.1)(:|\/|$)/.test(url)
  if (!isLocal) {
    throw new Error(
      "Refusing to seed test users: DATABASE_URL does not look like a local database. " +
        "Test helpers must never run against a non-local DATABASE_URL.",
    )
  }
}

/** Inserts a test user + credential account directly via Drizzle, bypassing the sign-up route. */
export async function createTestUser(role: UserRole) {
  assertLocalDatabase()

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

/**
 * Signs in through the real `/api/auth/sign-in/email` route (not a shortcut) so the returned
 * cookies are genuine, better-auth-issued session cookies, and returns them keyed by cookie name.
 */
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

/**
 * Creates a fresh test user for `role` and signs them in. Each call creates a distinct user, so
 * a test that needs two different admins (for example) can just call this twice. To avoid
 * re-signing-in (and re-hashing a password) on every test, call this once per role in a file's
 * `beforeAll` and reuse the returned `{ user, cookies }` from a local variable.
 */
export async function createAuthedUser(server: FastifyInstance, role: UserRole) {
  const testUser = await createTestUser(role)
  const cookies = await signInTestUser(server, testUser.email)
  return { user: testUser, cookies }
}

export async function deleteTestUser(userId: string): Promise<void> {
  await db.delete(user).where(eq(user.id, userId))
}
