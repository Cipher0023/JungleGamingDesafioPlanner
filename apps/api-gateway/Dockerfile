FROM node:20-alpine AS development
WORKDIR /app

COPY apps/api-gateway/package.json apps/api-gateway/package-lock.json* ./apps/api-gateway/

RUN cd apps/api-gateway && npm install

COPY apps/api-gateway ./apps/api-gateway

WORKDIR /app/apps/api-gateway

EXPOSE 3001
CMD ["npm", "run", "start:dev"]
