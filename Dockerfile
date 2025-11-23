# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules and Next.js runtime
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    ca-certificates \
    openssl \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package.json bun.lockb* ./

# Install production dependencies
RUN bun install --production --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Install build dependencies including image processing libraries
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    vips-dev \
    ca-certificates \
    openssl \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package.json bun.lockb* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# Copy Prisma schema first (for better caching)
COPY prisma ./prisma

# Copy application code (includes prisma.config.ts if it exists)
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client BEFORE building
# This must happen before the build as Next.js will import Prisma during build
RUN if [ -f "prisma/schema.prisma" ]; then \
      echo "Generating Prisma client..." && \
      bunx prisma generate; \
    else \
      echo "No Prisma schema found, skipping generation"; \
    fi

# Build the application (Prisma client is now available)
RUN bun run build

# Stage 3: Runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies for Next.js and native modules
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    openssl \
    curl \
    vips \
    && rm -rf /var/cache/apk/*

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files (schema and generated client)
COPY --from=builder /app/prisma ./prisma

# Copy next.config and other config files
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set correct permissions
RUN chown -R bunjs:bunjs /app

USER bunjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["bun", "start"]
