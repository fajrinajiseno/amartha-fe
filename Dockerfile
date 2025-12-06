FROM node:24.11.0-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build Next
COPY . .
RUN pnpm build

# Runtime
EXPOSE 3002 4001 4002

CMD ["pnpm", "start:all"]