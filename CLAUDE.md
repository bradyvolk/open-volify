# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open Volify is an open-source volunteer management platform. The stack is:

- **Frontend**: React 19, React Router v7, TanStack Query, Tailwind CSS v4, Radix UI (shadcn-style components), served via Bun's native bundler
- **Backend**: Fastify v5, Drizzle ORM, PostgreSQL, Better Auth, Resend for email
- **Runtime**: Bun throughout — never use Node, npm, pnpm, or vite

## Dev Commands

```bash
nvm use v24.13.1             # use the correct Node version

bun install                  # install dependencies
bun run dev                  # start both frontend and backend dev servers
bun dev:frontend             # frontend dev server at http://localhost:3001
bun dev:server               # backend API server at http://localhost:3006
bun run build                # build frontend to dist/ (required before Docker)
bun test                     # run tests
bun run format               # format all TypeScript files with Prettier
bun run format:check         # check formatting without writing (used in CI)

# DB migrations (run from project root, drizzle.config.ts is in backend/)
cd backend && bun drizzle-kit push    # push schema to local DB
cd backend && bun drizzle-kit generate  # generate migration files
```

## Architecture

### Monorepo Structure

Single `package.json` at root covers both `frontend/` and `backend/`. The `@/*` path alias resolves to `frontend/src/*`.

### Backend Entry Point

**Always start the server via `backend/src/bootstrap.ts`**, not `server.ts` directly. `bootstrap.ts` ensures this load order:

1. Load `backend/.env` via dotenv (no-op in Lambda where the file doesn't exist)
2. Fetch secrets from AWS Secrets Manager (populates `process.env` — a no-op locally when no `*_ARN` env vars are set)
3. Dynamically import `server.ts` so Drizzle/auth initialize only after env is fully populated

### Auth

Better Auth handles authentication at `/api/auth/*`. The backend `auth.ts` uses the Drizzle adapter and the `organization` plugin. Email verification is sent via Resend. The frontend consumes auth via `authClient` from `frontend/src/lib/auth-client.ts`, which points to `http://localhost:3006` in development and `window.location.origin` in production.

### Database Schema

All schema files live in `backend/src/db/schema/`. The auth schema (`auth-schema.ts`) covers `user`, `session`, `account`, `verification`, `organization`, `member`, and `invitation` tables — these are managed by Better Auth and must match what Better Auth expects.

### Migrations

Migrations are managed by Drizzle Kit. Run `bun drizzle-kit migrate` to run migrations. Migrations are stored in `backend/drizzle/`. Generate migrations with `bun drizzle-kit generate`.

### Dev vs Production

In development, the frontend (`localhost:3001`) and backend (`localhost:3006`) run as separate processes. In production, Fastify serves the pre-built frontend from `dist/` and the backend runs as a Docker container on AWS Lambda (via the AWS Lambda Web Adapter). The `deploy.sh` script handles building and pushing to ECR + S3/CloudFront.

### Secrets in Production

Lambda receives `DATABASE_SECRET_ARN`, `BETTER_AUTH_SECRET_ARN`, and `RESEND_API_KEY_ARN` env vars from Terraform. `secrets.ts` fetches each from AWS Secrets Manager and writes resolved values into `process.env`. To add a new secret, add an entry to `SECRET_SPECS` in `secrets.ts` and a corresponding resource in `terraform/secrets.tf`.

## Local Setup

```bash
cp backend/.env.example backend/.env
# Generate BETTER_AUTH_SECRET:
openssl rand -base64 32

# Start local Postgres:
docker run --name open-volify-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

Required `.env` values: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`.

## Contributing

Commit with commit messages like this:

```
git commit -m "Added <some feature>"
git commit -m "Fixed <some bug>"
```

Keep commit messages short.
