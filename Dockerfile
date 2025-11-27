# Base stage with dependencies
FROM oven/bun:1.3-slim AS base
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy package files and Prisma schema
COPY package.json bun.lock* ./
COPY prisma ./prisma

# Install dependencies (this will run prisma generate via postinstall)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build Next.js app
RUN bun run build

# Production stage
FROM oven/bun:1.3-slim AS production
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy Prisma files
COPY --from=base --chown=appuser:appuser /app/generated ./generated
COPY --from=base --chown=appuser:appuser /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base --chown=appuser:appuser /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=base --chown=appuser:appuser /app/prisma ./prisma

# Copy Next.js build
COPY --from=base --chown=appuser:appuser /app/.next/standalone ./
COPY --from=base --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=base --chown=appuser:appuser /app/public ./public

USER appuser

EXPOSE 3000

CMD ["bun", "run", "server.js"]
