FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
