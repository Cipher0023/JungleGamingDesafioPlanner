FROM node:20-alpine AS development
WORKDIR /app

COPY apps/auth-service/package.json apps/auth-service/package-lock.json* ./apps/auth-service/

RUN cd apps/auth-service && npm install

COPY apps/auth-service ./apps/auth-service

WORKDIR /app/apps/auth-service

EXPOSE 3002
CMD ["npm", "run", "start:dev"]
