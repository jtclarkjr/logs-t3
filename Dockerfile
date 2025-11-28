# Base stage with dependencies
FROM oven/bun:1.3-slim AS base
WORKDIR /app

# Install curl for health checks / diagnostics
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* drizzle.config.ts ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js app
RUN bun run build

# Production stage
FROM oven/bun:1.3-slim AS production
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Install curl for health checks / diagnostics
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy Next.js build
COPY --from=base --chown=appuser:appuser /app/.next/standalone ./
COPY --from=base --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=base --chown=appuser:appuser /app/public ./public

# Copy drizzle files and dependencies for schema push
COPY --from=base --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=base --chown=appuser:appuser /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=base --chown=appuser:appuser /app/src/server/db/schema.ts ./src/server/db/schema.ts
COPY --from=base --chown=appuser:appuser /app/package.json ./package.json

# Copy seed script
COPY --from=base --chown=appuser:appuser /app/scripts/seed.ts ./scripts/seed.ts

# Copy startup script
COPY --from=base --chown=appuser:appuser /app/scripts/docker-start.sh ./scripts/docker-start.sh
RUN chmod +x ./scripts/docker-start.sh

USER appuser

EXPOSE 3000

CMD ["./scripts/docker-start.sh"]
