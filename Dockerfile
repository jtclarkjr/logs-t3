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

USER appuser

EXPOSE 3000

CMD ["bun", "run", "server.js"]
