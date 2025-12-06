FROM node:24.11.0-alpine AS base
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# -------------------------
# Dependencies
# -------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -------------------------
# Build
# -------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build


# -------------------------
# Runtime
# -------------------------
FROM base AS runtime
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3002

CMD ["pnpm", "start", "-p", "3002"]
