# 1. Giai đoạn build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy metadata và cài dependencies
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci

# Copy source và build
COPY . .
RUN npm run build

# 2. Giai đoạn production
FROM node:18-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /dist ./dist
COPY --from=builder /node_modules ./node_modules

COPY ../../.env.production .env

RUN addgroup -S nest && adduser -S nest -G nest
USER nest

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "dist/apps/auth-service/src/main.js"]