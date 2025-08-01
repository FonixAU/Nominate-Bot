# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Build stage
FROM base AS build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential python3 pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Copy only package files first for better cache usage
COPY --link package.json package-lock.json ./

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy application source code (excluding files in .dockerignore)
COPY --link . .

# Production image
FROM base AS final

# Copy app and node_modules from build stage
COPY --from=build /app /app

# Set permissions and switch to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port if needed (Discord bots usually don't listen on HTTP, but for completeness)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
