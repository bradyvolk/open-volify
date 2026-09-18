---
name: using-worktrees
description: Set up and run a second working copy of Open Volify (e.g. a git worktree) alongside an existing one — its own ports, its own Postgres, no interference. Use when starting isolated feature work, running a task in parallel with other in-progress work, or asked to create/set up a worktree for this repo.
---

# Using Worktrees in Open Volify

Open Volify's dev servers bind to fixed ports and a single local Postgres by default, so two checkouts running `bun run dev` at the same time will collide unless each is given its own ports and database. This skill covers the repo-specific setup; for creating the worktree itself, prefer a native worktree tool (e.g. `EnterWorktree`) over raw `git worktree add` if one is available.

## Before touching anything

Check what's already running or in progress:

```bash
git worktree list
git branch -a
lsof -iTCP:3001 -iTCP:3006 -sTCP:LISTEN -P
docker ps
```

- Never assume a branch checked out elsewhere, or ports already listening, are yours to touch or free. If another worktree/branch is mentioned as someone else's active work, don't check it out, rebase it, or kill its processes.
- If you need to stop a dev server, kill the specific PID (confirm via `lsof -p <pid> | grep cwd` that it belongs to your worktree first) — never `pkill -f "bun --hot ..."`, since that pattern matches every checkout running the same script, including someone else's.

## Set up the new checkout

```bash
git worktree add ../open-volify-<name> -b <branch>   # or your native worktree tool
cd ../open-volify-<name>
bun install
cp backend/.env.example backend/.env
openssl rand -base64 32   # put this in BETTER_AUTH_SECRET
```

## Give it its own ports

Edit the new checkout's `backend/.env` — change `PORT`, `FRONTEND_PORT`, and `BETTER_AUTH_URL` together (they must stay consistent with each other):

```
PORT=3106
FRONTEND_PORT=3101
BETTER_AUTH_URL=http://localhost:3106
```

Pick a pair that doesn't collide with any other instance you know is running. `bun run dev` runs `scripts/check-ports.ts` first and fails fast with a clear message if either port is taken — don't skip past that check by killing whatever's on the port without confirming it isn't someone else's session.

The frontend never needs to know the backend's port explicitly: `frontend/src/index.ts` proxies `/api/*` to `http://localhost:${PORT}` itself, so the browser only ever talks to one origin (`FRONTEND_PORT`), matching how production serves both from the same Fastify origin. Don't reintroduce a `BUN_PUBLIC_*`-style env var for the API URL — Bun's dev server does not inline arbitrary `process.env.*` vars into the client bundle (only `NODE_ENV` gets special-cased), so a bare `process.env.SOMETHING` reference in frontend code throws `ReferenceError: process is not defined` in the browser. If you need the client to know something at runtime, either derive it from `window.location` or route it through the `/api` proxy.

## Give it its own Postgres

```bash
docker run --name open-volify-postgres-<name> -e POSTGRES_PASSWORD=password -d -p 5433:5432 postgres
```

Use a host port that isn't already bound (`docker ps` shows what's taken). Set `DATABASE_URL` in the new checkout's `backend/.env` to match, then migrate:

```
DATABASE_URL=postgres://postgres:password@localhost:5433/postgres
```

```bash
cd backend && bun drizzle-kit migrate && cd ..
```

## Run it

```bash
bun run dev
```

Both instances can now run at once, each fully isolated: its own ports, its own database, no shared CORS/auth-origin config to reconcile.

## Tearing down

When the worktree's work is done: stop its dev server (by PID, not by pattern), `docker stop`/`docker rm` its Postgres container if no longer needed, and remove the worktree via your worktree tool's cleanup (or `git worktree remove`). Don't remove another worktree's containers or branches without being asked.
