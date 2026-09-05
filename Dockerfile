# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./

RUN npm ci

# Copy application source/config
COPY . .

# Build NestJS application
RUN npm run build


# ---------- Production stage ----------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application from builder
COPY --from=builder /app/dist ./dist

# Start NestJS
CMD ["node", "dist/main.js"]

# docker push ghcr.io/ami237165/upload-service:1.0.0 .