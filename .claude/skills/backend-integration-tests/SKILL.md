---
name: backend-integration-tests
description: Write real-HTTP integration tests for a backend Fastify feature (test server, role-based auth fixtures, error-handling conventions). Use when adding or reviewing integration tests under backend/src/tests/, or writing a new backend API route/controller.
---

# Backend Integration Tests

Test against the real app, not mocks: build the actual Fastify instance and hit it with real requests and real auth cookies. Modeled on `backend/src/tests/integration/people.integration.test.ts`.

## Setup

```ts
import { buildTestServer } from "../helpers/test-server"
import { createAuthedUser, deleteTestUsers } from "../helpers/test-auth"

let server: FastifyInstance
let admin: Awaited<ReturnType<typeof createAuthedUser>>

beforeAll(async () => {
  server = await buildTestServer() // real buildServer() + .ready()
  admin = await createAuthedUser(server, "admin") // one per role, reused across the file
})

afterAll(async () => {
  await deleteTestUsers([admin.user.id])
  await server.close()
})
```

Use `server.inject({ method, url, cookies: admin.cookies, payload })`, never mock the router/middleware.

## Auth fixtures (`backend/src/tests/helpers/test-auth.ts`)

- `createTestUser(role)` — inserts user + credential account directly via Drizzle (fast, skips signup flow).
- `signInTestUser(server, email)` — signs in through the real `/api/auth/sign-in/email` route so cookies are genuine, not faked.
- `createAuthedUser(server, role)` — composes both, returns `{ user, cookies }`. Call once per role in `beforeAll`; call again mid-test only if you need a second, distinct same-role user.
- `deleteTestUsers(ids)` — bulk cleanup for `afterAll`.
- Any new user-seeding/deletion helper must go through `assertLocalDatabase()` first — refuses to run against a non-local `DATABASE_URL`. Never bypass this.

For feature-specific records created during tests (e.g. contacts), track their IDs in an array and bulk-delete directly via Drizzle in `afterEach` — don't clean up over HTTP.

## Coverage checklist

One `describe` block per resource, covering:

- **No session** — every route returns 401.
- **Permissions** — a role without access gets 403, *and* assert the denied action didn't happen (e.g. record wasn't created/deleted).
- **Validation** — missing/invalid fields return 400.
- **Conflicts** — duplicate unique field returns 409.
- **CRUD happy path** — create → read → update → delete → 404 after delete, in one test.

## Controller error handling

Use `@fastify/sensible`'s `httpErrors` inside a plain try/catch, not custom error classes:

```ts
} catch (error) {
  if ((error as { cause?: { code?: unknown } })?.cause?.code === "23505") {
    throw httpErrors.conflict("A contact with this email already exists")
  }
  throw error
}
```

Drizzle wraps driver errors in `DrizzleQueryError` with the real Postgres error on `.cause` — check `.cause.code`, not `error.code`. Let the single centralized handler in `server.ts` turn thrown errors into responses (ZodError → 400, then `error.statusCode`, else 500) — don't add per-route error handling.

**Gotcha:** any `preHandler` (auth, permissions) must `throw` its error (e.g. `throw httpErrors.unauthorized()`), never call `reply.send()` and return. A reply without a throw doesn't stop Fastify's preHandler chain, so the route handler still runs.
