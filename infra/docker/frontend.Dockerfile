# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source files
COPY frontend/app ./app
COPY frontend/components ./components
COPY frontend/hooks ./hooks
COPY frontend/lib ./lib
COPY frontend/types ./types
COPY frontend/public ./public
COPY frontend/src ./src

# Copy config files
COPY frontend/next.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tsconfig.json ./

# Build-time environment variables
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
ARG NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL

# Build
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --omit=dev

# Copy build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Create non-root user (node:20-alpine reserves UID 1000 for built-in 'node' user)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
