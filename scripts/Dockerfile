FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files to /app and install there
# This makes node_modules available to both scripts and content/schema.ts
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Keep container running for exec commands
CMD ["tail", "-f", "/dev/null"]
