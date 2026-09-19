---
name: using-worktrees
description: Set up and run a second working copy of Open Volify (e.g. a git worktree) alongside an existing one, with its own ports and Postgres. Use when starting isolated feature work or asked to create a worktree for this repo.
---

# Using Worktrees in Open Volify

Two checkouts running `bun run dev` collide on ports and the database unless each has its own. Prefer a native worktree tool (e.g. `EnterWorktree`) over raw `git worktree add`.

## Before touching anything

```bash
git worktree list
lsof -iTCP:3001 -iTCP:3006 -sTCP:LISTEN -P
docker ps
```

Don't check out, rebase, or kill processes belonging to another worktree. To stop a dev server, kill its specific PID (verify with `lsof -p <pid> | grep cwd`), never `pkill -f`.

## Setup

```bash
git worktree add ../open-volify-<name> -b <branch>
cd ../open-volify-<name>
bun install
cp backend/.env.example backend/.env
```

In the new `backend/.env`, set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) and pick unused ports, keeping the three port settings consistent:

```
PORT=3106
FRONTEND_PORT=3101
BETTER_AUTH_URL=http://localhost:3106
```

Start a separate Postgres on an unused host port and point `DATABASE_URL` at it:

```bash
docker run --name open-volify-postgres-<name> -e POSTGRES_PASSWORD=password -d -p 5433:5432 postgres
```

```
DATABASE_URL=postgres://postgres:password@localhost:5433/postgres
```

Then migrate and run:

```bash
cd backend && bun drizzle-kit migrate && cd ..
bun run dev
```

## Notes

- The frontend dev server proxies `/api/*` to `PORT`, so frontend code never needs the backend URL.
- Bun doesn't inline `process.env.*` into the client bundle (except `NODE_ENV`), so don't reference env vars in frontend code; derive values from `window.location` instead.

## Tearing down

Stop the dev server by PID, `docker rm -f` its Postgres container, and remove the worktree.
