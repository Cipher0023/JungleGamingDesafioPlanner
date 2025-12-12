FROM node:20-alpine AS development
WORKDIR /app

# Copiar o package.json do web
COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/

# Instalar dependências do web
RUN cd apps/web && npm install

# Copiar apenas o código do web
COPY apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]