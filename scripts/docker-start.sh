#!/bin/sh
set -e

echo "Running database migrations..."
bun run drizzle-kit push --force

# Seed database if SEED_DATABASE env var is set to "true"
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database with sample data..."
  bun run scripts/seed.ts
fi

echo "Starting application..."
exec bun run server.js
