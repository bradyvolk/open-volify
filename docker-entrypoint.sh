#!/bin/sh
set -e

echo "Running database migrations..."
bun run backend/src/migrate.ts

echo "Starting Open Volify server..."
exec bun run backend/src/bootstrap.ts
