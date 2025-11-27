# Logs Dashboard - T3 Stack

A full-stack logs dashboard application built with the T3 Stack (Next.js, TypeScript, Prisma, tRPC, Tailwind CSS).

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety across the entire stack
- **Prisma** - Type-safe database ORM
- **tRPC** - End-to-end type-safe APIs
- **PostgreSQL** - Database
- **Tailwind CSS** - Styling
- **Bun** - Fast JavaScript runtime and package manager

## Features

### Backend (tRPC API)
- Create, read, update, delete log entries
- Filter logs by severity, source, date range, and text search
- Pagination and sorting
- Analytics and aggregation data
- Time series chart data (hourly, daily, weekly, monthly)
- Metadata endpoints (sources, severity levels, date ranges)

### Database Schema
```prisma
model LogEntry {
  id        String         @id @default(uuid())
  timestamp DateTime       @default(now())
  message   String
  severity  SeverityLevel  // DEBUG, INFO, WARNING, ERROR, CRITICAL
  source    String
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}
```

## Getting Started

### Prerequisites
- Bun installed
- Docker (optional, for running PostgreSQL)

### Installation

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up environment variables**
   The `.env` file should already exist with:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/logs-t3"
   ```

3. **Start the database**
   ```bash
   make db          # Start PostgreSQL in Docker
   ```

4. **Push database schema**
   ```bash
   make db-push     # Create tables in database
   ```

5. **Start development server**
   ```bash
   make dev         # or: bun run dev
   ```

The app will be running at http://localhost:3000

## Available Commands

### Development
```bash
make dev          # Start Next.js dev server
make build        # Build for production
make start        # Start production server
```

### Database
```bash
make db           # Start PostgreSQL only
make db-stop      # Stop database
make db-push      # Push schema to database (no migration files)
make db-migrate   # Create and run migrations
make db-studio    # Open Prisma Studio (database GUI)
make db-seed      # Seed 1000 sample log entries (pass ARGS=--reset to clear first)
```

### Docker
```bash
make up           # Start all services (database + app)
make down         # Stop all services
make clean        # Stop and remove all containers/volumes
make logs         # View logs from all services
make logs-db      # View database logs
make logs-app     # View app logs
```

## Using tRPC

### In Server Components
```typescript
import { api } from "@/trpc/server";

const logs = await api.logs.getAll({ page: 1, pageSize: 20 });
```

### In Client Components
```typescript
"use client";
import { api } from "@/trpc/react";

function LogsTable() {
  const { data, isLoading } = api.logs.getAll.useQuery({
    page: 1,
    pageSize: 20
  });

  const deleteMutation = api.logs.delete.useMutation();

  // ...
}
```

## Available tRPC Endpoints

All endpoints are available under `api.logs.*`:

### Queries (Read Operations)
- `logs.getAll({ page, pageSize, severity?, source?, startDate?, endDate?, search?, sortBy?, sortOrder? })` - Get paginated logs with filters
- `logs.getById({ id })` - Get single log by ID
- `logs.getAggregation({ startDate?, endDate?, severity?, source? })` - Get aggregation data for analytics
- `logs.getChartData({ startDate?, endDate?, severity?, source?, groupBy })` - Get time series data
- `logs.getMetadata()` - Get metadata (sources, severity levels, stats)

### Mutations (Write Operations)
- `logs.create({ message, severity, source, timestamp? })` - Create new log
- `logs.update({ id, data })` - Update existing log
- `logs.delete({ id })` - Delete log

### Example Usage
```typescript
// Create a log
const createMutation = api.logs.create.useMutation();
await createMutation.mutateAsync({
  message: "Application started",
  severity: "INFO",
  source: "app-server"
});

// Get logs with filters
const { data } = api.logs.getAll.useQuery({
  page: 1,
  pageSize: 20,
  severity: "ERROR",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31")
});

// Get aggregation data
const { data } = api.logs.getAggregation.useQuery({
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31")
});
```

## API Usage

- Postman collection: import `postman_collection.json` (repo root), set `baseUrl` (e.g., `http://localhost:3000`), and send. Requests already wrap payloads under `json` to match the tRPC handler.

## Project Structure

```
logs-t3/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/  # tRPC routers
│   │   │   │   └── logs.ts
│   │   │   ├── root.ts   # Root router
│   │   │   └── trpc.ts   # tRPC setup
│   │   └── db.ts         # Prisma client
│   ├── trpc/
│   │   ├── query-client.ts
│   │   ├── react.tsx     # tRPC React client
│   │   └── server.ts     # tRPC server client
│   └── env.js            # Environment validation
├── prisma/
│   └── schema.prisma     # Database schema
├── docker-compose.yml    # Docker services
├── Dockerfile            # Container image
├── Makefile              # Development commands
└── package.json
```

## Docker Deployment

Build and run with Docker:

```bash
# Start all services
make up

# Or manually:
docker compose up -d --build
```

The app will be available at http://localhost:3000 with PostgreSQL running on port 5432.

## Environment Variables

Required environment variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/logs-t3"
```

## Development Workflow

1. Start the database: `make db`
2. Push schema changes: `make db-push`
3. Start dev server: `make dev`
4. Make changes to schema → run `make db-push`
5. Make changes to tRPC routers → hot reload automatic

## Migration from Python FastAPI

This project replaces the Python FastAPI backend with a full TypeScript stack:

| Old (Python) | New (T3) |
|-------------|----------|
| FastAPI routes | tRPC procedures |
| SQLAlchemy | Prisma |
| Pydantic schemas | Zod schemas |
| Separate frontend/backend | Monolithic Next.js |
| REST API | tRPC (RPC over HTTP) |

### Benefits
- End-to-end type safety
- No API route definitions needed
- Automatic API client generation
- Single codebase
- Better DX with autocomplete
- Smaller bundle size

## Next Steps

To complete the migration:

1. **Copy UI components** from your existing logs-dashboard
2. **Create pages** in `src/app/` directory
3. **Use tRPC hooks** instead of REST API calls
4. **Add Tailwind components** for the dashboard UI
5. **Test the application** with real data

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), check out:

- [Documentation](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
