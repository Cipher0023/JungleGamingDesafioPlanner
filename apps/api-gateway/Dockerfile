FROM node:20-alpine AS development

WORKDIR /app

# Copia apenas os manifests para instalar dependências
COPY apps/api-gateway/package.json apps/api-gateway/package-lock.json* ./apps/api-gateway/

RUN cd apps/api-gateway && npm install

# Copia o restante do código
COPY apps/api-gateway ./apps/api-gateway

WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
