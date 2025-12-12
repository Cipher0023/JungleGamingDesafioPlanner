# Development image for NestJS
FROM node:20-alpine AS development
WORKDIR /app

# Copiar package.json específico do serviço
COPY apps/notifications-service/package.json apps/notifications-service/package-lock.json* ./apps/notifications-service/

# Instalar dependências
RUN cd apps/notifications-service && npm install

# Copiar o código completo do serviço
COPY apps/notifications-service ./apps/notifications-service

# Definir diretório de trabalho final
WORKDIR /app/apps/notifications-service

# Expor porta
EXPOSE 3004

# Rodar Nest em modo dev (watch)
CMD ["npm", "run", "start:dev"]
