# Stage 1: 빌드
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build && npm run deploy:prepare

# Stage 2: 실행 (빌드 결과물만 포함)
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/deploy ./

RUN npm ci --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]