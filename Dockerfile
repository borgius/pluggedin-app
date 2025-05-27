FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Files needed for pnpm install
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1 NODE_TLS_REJECT_UNAUTHORIZED=0

# Accept DATABASE_URL at build time
ARG DATABASE_URL_BUILD_TIME
ENV DATABASE_URL=${DATABASE_URL_BUILD_TIME}

RUN pnpm build

# Migration stage
FROM base AS migrator
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
CMD ["pnpm", "drizzle-kit", "migrate"]

# development image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=development NEXT_TELEMETRY_DISABLED=1 NODE_TLS_REJECT_UNAUTHORIZED=0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
