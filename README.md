<p align="center">
  <img src="./frontend/src/assets/open-volify-logo-large.png" alt="Open Volify" width="320" />
</p>

<p align="center">
  An open-source volunteer management platform for nonprofits.
</p>

<p align="center">
  <img alt="License: AGPL-3.0" src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" />
  <img alt="Status: early development" src="https://img.shields.io/badge/status-early%20development-orange.svg" />
</p>

---

> [!WARNING]
> Open Volify is pre-1.0 and under active construction. APIs, schema, and features will change. It is not yet recommended for production use. Contributions, issues, and feedback are very welcome!

## What is Open Volify?

Open Volify gives nonprofits a complete back-office system for running volunteer programs including contact management, event organizing, volunteer scheduling, donation tracking, and more.

Nonprofits can self-host their own instance. Many orgs run their volunteer programs out of spreadsheets and email today; Open Volify aims to be the approachable, open alternative.

### Modules (MVP)

| Module            | Description                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **People**        | Unified contact directory — volunteers, staff, board members, external contacts. Staff have full CRUD; volunteers log in and manage their own profile and registrations. |
| **Groups**        | Internal groupings — departments, teams, committees. A person can belong to multiple groups.                                                                             |
| **Organizations** | External entity records — partner nonprofits, sponsors, schools. Contacts can be affiliated with one or more.                                                            |
| **Events**        | One-off events that staff create and volunteers register for.                                                                                                            |

## Tech Stack

- **Frontend:** React 19, React Router v7, TanStack Query, Tailwind CSS v4, Shadcn UI
- **Backend:** Fastify v5, Drizzle ORM, PostgreSQL, Better Auth, Resend
- **Runtime:** [Bun](https://bun.com) throughout (no Node/npm/vite)

## Getting Started

### Prerequisites

- [Bun](https://bun.com/docs/installation)
- [Docker](https://docs.docker.com/engine/install/) (for local Postgres)

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/bradyvolk/open-volify.git
   cd open-volify
   bun install
   ```

2. **Configure environment**

   ```bash
   cp ./backend/.env.example ./backend/.env
   ```

   Generate a `BETTER_AUTH_SECRET` and add it to `backend/.env`:

   ```bash
   openssl rand -base64 32
   ```

   Fill in any other API keys/secrets as needed (e.g. `RESEND_API_KEY` for email).

3. **Start a local Postgres**

   ```bash
   docker run --name open-volify-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
   ```

4. **Run the database migrations**

   ```bash
   cd backend && bun drizzle-kit migrate && cd ..
   ```

5. **Start the dev servers**

   ```bash
   bun run dev
   ```

   - Frontend: http://localhost:3001
   - API: http://localhost:3006

   (Or run them separately with `bun dev:frontend` and `bun dev:server`.)

### Tests

```bash
bun test
```

Currently, tests run against a real local Postgres (no DB mocking), so make sure your database is running first.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup details and conventions before opening a pull request.

## License

Open Volify is licensed under the [GNU AGPL-3.0](./LICENSE).
