# 🚀 Jungle Gaming - Sistema de Gestão de Tarefas Colaborativo

## 📋 Resumo

Sistema full-stack de gestão de tarefas com autenticação JWT, microserviços NestJS, WebSocket para notificações em tempo real e frontend React com TanStack Router.

## ⚙️ Stack

- **Frontend:** React 19 + TanStack Router + Tailwind CSS
- **Backend:** NestJS (4 microserviços) + TypeORM + PostgreSQL
- **Mensageria:** RabbitMQ
- **Real-time:** WebSocket (Socket.io)
- **Containerização:** Docker & Docker Compose

## 🏗️ Arquitetura

```
Frontend (React, 3000)
    ↓
API Gateway (3001) [Proxy + Rate Limiting + Swagger]
    ├→ Auth Service (3002) [JWT, Register, Login, Refresh]
    ├→ Tasks Service (3003) [CRUD Tasks + RabbitMQ Producer]
    └→ Notifications Service (3004) [WebSocket + RabbitMQ Consumer]

Shared:
  - PostgreSQL (5432)
  - RabbitMQ (5672)
```

## 🚀 Como Rodar

### Pré-requisitos

- Docker & Docker Compose
- Node.js 18+ (opcional, para dev local)
- npm 11+

### Opção 1: Com Docker Compose (Recomendado)

```bash
cd project
docker-compose up --build
```

Espere ~1 min para todas as dependências serem instaladas.

### Opção 2: Desenvolvimento Local

1. **Instalar dependências**

```bash
npm install
```

2. **Iniciar serviços (em terminais separados)**

Terminal 1: Frontend

```bash
cd apps/web && npm run dev
```

Terminal 2: Auth Service

```bash
cd apps/auth-service && npm run start:dev
```

Terminal 3: Tasks Service

```bash
cd apps/tasks-service && npm run start:dev
```

Terminal 4: Notifications Service

```bash
cd apps/notifications-service && npm run start:dev
```

Terminal 5: API Gateway

```bash
cd apps/api-gateway && npm run start:dev
```

## 🌐 URLs

| Serviço       | URL                            | Descrição                    |
| ------------- | ------------------------------ | ---------------------------- |
| Frontend      | http://localhost:3000          | Aplicação React              |
| API Gateway   | http://localhost:3001          | HTTP API + Swagger           |
| Swagger       | http://localhost:3001/api/docs | Documentação OpenAPI         |
| Auth Service  | http://localhost:3002          | Microserviço de Autenticação |
| Tasks Service | http://localhost:3003          | Microserviço de Tarefas      |
| Notifications | ws://localhost:3004            | WebSocket Real-time          |
| RabbitMQ      | http://localhost:15672         | Admin (admin:admin)          |
| PostgreSQL    | localhost:5432                 | Database                     |

## 📚 Endpoints

### Autenticação (POST /api/auth/\*)

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login com email e password
- `POST /auth/refresh` - Renovar access token

### Tarefas (GET/POST /api/tasks/\*)

- `POST /tasks` - Criar tarefa
- `GET /tasks?page=1&size=10` - Listar tarefas (paginado)
- `GET /tasks/:id` - Detalhe da tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `POST /tasks/:id/comments` - Adicionar comentário
- `GET /tasks/:id/comments?page=1` - Listar comentários
- `POST /tasks/:id/assign` - Atribuir tarefa a usuário

## 🔐 Autenticação

1. **Registre-se** em http://localhost:3000/register
2. **Faça login** em http://localhost:3000/login
3. Token JWT será armazenado no localStorage
4. Access Token expira em 15 min
5. Use refresh token para obter novo access token

## 🔔 WebSocket Events

Cliente conecta com: `ws://localhost:3004?userId=<user-id>`

Eventos emitidos pelo servidor:

- `task:created` - Nova tarefa criada
- `task:updated` - Tarefa atualizada
- `task:assigned` - Tarefa atribuída ao usuário
- `comment:new` - Novo comentário em tarefa

## 📊 Fluxo de Eventos (RabbitMQ)

1. User cria/atualiza tarefa via HTTP
2. Tasks Service publica evento em RabbitMQ
3. Notifications Service consome evento
4. Notificação é persistida no BD
5. WebSocket notifica usuários conectados

## 🧪 Testando Fluxo Completo

### 1. Criar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"123456"}'
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Copie o `accessToken` retornado.

### 3. Criar Tarefa

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha Tarefa","description":"Uma descrição","priority":"HIGH"}'
```

### 4. Listar Tarefas

```bash
curl http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Conectar WebSocket (Node.js)

```javascript
const io = require("socket.io-client");
const socket = io("ws://localhost:3004", {
  query: { userId: "user-id-here" },
});

socket.on("task:created", (data) => console.log("Nova tarefa:", data));
socket.on("comment:new", (data) => console.log("Novo comentário:", data));
```

## 🛠️ Troubleshooting

### Erro: "Service unavailable"

- Aguarde 60s para PostgreSQL/RabbitMQ iniciarem
- Verifique logs: `docker-compose logs -f <service-name>`

### Erro: "Connection refused"

- Verifique se todos containers estão rodando: `docker-compose ps`
- Reinicie: `docker-compose down && docker-compose up`

### Erro: "ENOSPC"

- Espaço em disco insuficiente
- Limpe volumes: `docker system prune -a`

## 📝 Estrutura de Pastas

```
project/
├── apps/
│   ├── web/                    # React Frontend
│   ├── api-gateway/            # HTTP Proxy + Rate Limiting
│   ├── auth-service/           # Autenticação JWT
│   ├── tasks-service/          # CRUD Tarefas + RabbitMQ Producer
│   └── notifications-service/  # WebSocket + RabbitMQ Consumer
├── packages/
│   ├── types/                  # Types compartilhados
│   ├── ui/                     # shadcn/ui components
│   └── typescript-config/
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 🎯 Decisões Técnicas

| Aspecto         | Escolha             | Motivo                                  |
| --------------- | ------------------- | --------------------------------------- |
| ORM             | TypeORM             | Requisito obrigatório + suporte robusto |
| Auth            | JWT + Refresh Token | Escalável + Stateless                   |
| Mensageria      | RabbitMQ            | Confiabilidade + Durabilidade           |
| Real-time       | Socket.io           | Simples + Fallback HTTP                 |
| Frontend Router | TanStack Router     | Performático + Type-safe                |
| UI Components   | shadcn/ui           | Customizável + Acessível                |
| Database        | PostgreSQL          | Robustez + ACID transactions            |

## ⏱️ Tempo de Implementação

- Auth Service: ~30 min
- Tasks Service: ~45 min
- Notifications: ~45 min
- API Gateway: ~20 min
- Frontend: ~60 min
- Docker & Testes: ~30 min
- **Total: ~3.5h**

## 🚨 Problemas Conhecidos & Melhorias

### Conhecidos

- ❌ Rate limiting ainda não está ativo (comentado em throttler)
- ❌ Audit log é básico (só criação/atualização)
- ⚠️ Sem testes unitários/E2E neste MVP

### Melhorias Futuras

- ✅ Testes unitários com Jest
- ✅ Testes E2E com Cypress
- ✅ Health checks nos serviços
- ✅ Logging centralizado (Winston/ELK)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Suporte a reset de senha
- ✅ Avatar de usuários (S3/CloudStorage)
- ✅ Cache com Redis
- ✅ Busca full-text de tarefas

## 📄 Licença

MIT

---

**Desenvolvido para:** Jungle Gaming Junior Full-stack Challenge
**Data:** 17 de Dezembro de 2025
**Stack:** React + NestJS + TypeORM + RabbitMQ + Docker
