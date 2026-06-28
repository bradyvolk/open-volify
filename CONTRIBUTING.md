# Contributing to Open Volify

Thanks for your interest in contributing! Open Volify is an early-stage open-source project, and we welcome issues, pull requests, and feedback.

## Ground rules

- Be respectful and constructive.
- Open an issue before starting significant work so we can align on direction.
- Keep pull requests focused — one logical change per PR.

## Development setup

Open Volify uses [Bun](https://bun.com) for everything — **do not use Node, npm, pnpm, or vite.**

1. Install [Bun](https://bun.com/docs/installation) and [Docker](https://docs.docker.com/engine/install/).
2. Follow the [Getting Started](./README.md#getting-started) steps in the README to install dependencies, set up `backend/.env`, start Postgres, and run migrations.
3. Start the dev servers with `bun run dev`.

## Project layout

A single `package.json` at the root covers both `frontend/` and `backend/`.

- `frontend/` — React 19 + React Router v7 app, served by Bun's bundler. The `@/*` alias resolves to `frontend/src/*`.
- `backend/` — Fastify API, Drizzle ORM, Better Auth. Always start the server via `backend/src/bootstrap.ts`.
- `backend/src/db/schema/` — Drizzle schema. The auth schema is managed by Better Auth and must match what it expects.
- `backend/drizzle/` — generated migration files.
- `terraform/` — reference AWS infrastructure for the maintainers' hosted deployment. You generally won't need this for local work.

## Database & migrations

- Generate migrations with `cd backend && bun drizzle-kit generate` — commit the generated SQL files.
- Apply them with `bun drizzle-kit migrate`.
- `bun drizzle-kit push` is for **local development only** — never use it against staging or production.

## Conventions

- **Validation:** Zod on all API routes (body, params, query).
- **Controllers:** keep them thin — route → Zod validation → controller → Drizzle query. Move business logic into service files if it grows.
- **Frontend server state:** TanStack Query only — no raw `fetch` in components.
- **Forms:** React Hook Form + Zod, sharing schemas with the API where possible.
- **Tests:** integration tests against a real local database, no DB mocking.

## Tests

Run the suite with `bun test` (requires a running local Postgres). Please add or update tests for any behavior change.

## Commit messages

Keep them short and descriptive, e.g.:

```
git commit -m "Add group membership endpoint"
git commit -m "Fix event capacity validation"
```

## Pull requests

1. Fork the repo and create a feature branch.
2. Make your change, with tests where applicable.
3. Ensure `bun test` passes and the app runs.
4. Open a PR with a clear description of what changed and why.

By contributing, you agree that your contributions will be licensed under the project's [AGPL-3.0](./LICENSE) license.
