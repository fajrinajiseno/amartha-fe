FROM node:24.11.0-alpine AS base
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# -----------------------
# Install dependencies
# -----------------------
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -----------------------
# Build Next.js
# -----------------------
COPY . .
RUN pnpm build

# -----------------------
# Runtime
# -----------------------
# Next on 3002, mocks on 4001/4002
EXPOSE 3002 4001 4002

CMD ["pnpm", "start:all"]