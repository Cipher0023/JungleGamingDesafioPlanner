# Development image for NestJS
FROM node:20-alpine AS development
WORKDIR /app

# Copiar package.json específico
COPY apps/tasks-service/package.json apps/tasks-service/package-lock.json* ./apps/tasks-service/

# Instalar dependências
RUN cd apps/tasks-service && npm install

# Copiar código do serviço
COPY apps/tasks-service ./apps/tasks-service

# Definir diretório de trabalho
WORKDIR /app/apps/tasks-service

# Porta do serviço
EXPOSE 3003

# Rodar Nest em dev
CMD ["npm", "run", "start:dev"]
