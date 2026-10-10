FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY src ./src
COPY generated ./generated

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]