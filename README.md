# Logs Dashboard - T3 Stack

A full-stack logs dashboard application built with the T3 Stack (Next.js, TypeScript, Drizzle ORM, tRPC, Tailwind CSS).

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety across the entire stack
- **Drizzle ORM** - Typed SQL builder for PostgreSQL
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

### Frontend (Next.js + React)
- **Dashboard Page** - Interactive analytics with charts
  - Timeline chart showing log volume over time
  - Severity distribution pie chart
  - Top sources bar chart
  - Filters by date range, severity, and source
- **Logs Management** - Full CRUD interface
  - Searchable and filterable table
  - Create, view, update, and delete logs
  - Advanced filtering (severity, source, date range, text search)
  - Pagination with customizable page size
  - Sort by timestamp, severity, or source
- **UI Components** - 38+ Shadcn/UI components
  - Built on Radix UI primitives
  - Full keyboard navigation and accessibility
  - Toast notifications for user feedback

### Database Schema
Defined with Drizzle in `src/server/db/schema.ts`:
```ts
const severityEnum = pgEnum("severity_level", [
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

export const logs = pgTable("logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  message: text("message").notNull(),
  severity: severityEnum("severity").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
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
make db-push      # Push schema to database via drizzle-kit
make db-migrate   # Apply migrations from drizzle
make db-studio    # Open Drizzle Studio
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

## Testing with Postman

A complete Postman collection is available for testing the API:

1. **Import Collection**
   - Import `postman_collection.json` from the repository root
   - The collection includes all CRUD and analytics endpoints

2. **Configure Base URL**
   - Set the `baseUrl` variable to your server URL
   - Default: `http://localhost:3000`
   - If port 3000 is in use: `http://localhost:3002`

3. **Collection Contents**
   - **CRUD Operations:**
     - Create Log Entry
     - Get All Logs (with/without filters)
     - Get Log by ID
     - Update Log Entry
     - Delete Log Entry
   - **Analytics:**
     - Get Aggregation Data
     - Get Chart Data (hourly/daily/weekly/monthly)
     - Get Metadata

4. **Important Notes**
   - All parameters use **camelCase** (e.g., `pageSize`, not `page_size`)
   - IDs are **UUID strings**, not numbers
   - Query parameters are wrapped in `{"json":{...}}` format
   - All example requests and responses match the actual API

### Example Usage

**Create a log:**
```http
POST /api/trpc/logs.create
Content-Type: application/json

{
  "message": "Application started successfully",
  "severity": "INFO",
  "source": "api-server"
}
```

**Get logs with filters:**
```http
GET /api/trpc/logs.getAll?input={"json":{"page":1,"pageSize":20,"severity":"ERROR"}}
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

### Benefits
- End-to-end type safety
- No API route definitions needed
- Automatic API client generation
- Single codebase
- Better DX with autocomplete
- Smaller bundle size

### Pages Available

- **Dashboard** (`/dashboard`) - Analytics with charts and aggregation data
- **Logs** (`/logs`) - Full CRUD interface with filtering, search, and pagination

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), check out:

- [Documentation](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
