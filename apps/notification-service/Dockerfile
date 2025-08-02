FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY ../../.env.production .env

RUN addgroup -S nest && adduser -S nest -G nest
USER nest

ENV NODE_ENV=production
EXPOSE 3003

CMD ["node", "dist/apps/notification-service/src/main.js"]