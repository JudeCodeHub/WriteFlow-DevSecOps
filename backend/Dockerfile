# ---- Build stage ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# ---- Production stage ----
FROM node:24-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Security: apply latest OS security patches, then add only what's needed
RUN apk upgrade --no-cache && apk --no-cache add dumb-init=1.2.5-r4

# Security: patch npm's bundled tar (CVE-2026-73566), then remove npm's
# own download cache so its cached tarballs aren't left in the image
# for scanners to flag as "installed" packages
RUN npm install -g npm@latest && npm cache clean --force && rm -rf /root/.npm

WORKDIR /app

# Copy only production dependencies from build stage
COPY --from=build /app/node_modules ./node_modules
COPY src/ ./src/

# Security: own files by non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Security: use dumb-init for proper signal handling (PID 1 problem)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
