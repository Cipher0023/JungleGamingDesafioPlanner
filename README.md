# 🎮 Jungle Gaming - Task Management System

Sistema de gerenciamento de tarefas colaborativo em tempo real, construído com arquitetura de microserviços escalável.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

## 🎯 Destaques

**Arquitetura:**

- ⚡ 4 microserviços independentes (API Gateway, Auth, Tasks, Notifications)
- 🔄 Comunicação assíncrona via RabbitMQ
- 📡 Notificações em tempo real com WebSocket (Socket.IO)
- 🐳 Orquestração completa com Docker Compose

**Segurança & Validação:**

- 🔐 Autenticação JWT + Passport com refresh tokens
- ✅ Validação client-side (Zod + react-hook-form) e server-side (class-validator)
- 🛡️ Rate limiting e proteção DDoS
- 🔒 Bcrypt para hashing de senhas

**Frontend Moderno:**

- ⚛️ React 19 + TanStack Router type-safe
- 🎨 shadcn/ui (16 componentes) + Tailwind CSS
- 📱 Interface responsiva com views Grid e Kanban
- 🎭 Skeleton loaders e animações suaves

---

## 🏗️ Arquitetura

### Visão Geral do Sistema

```
┌───────────────────┐
│   React Frontend  │ ←──┐
│   (Port 3000)     │    │
└─────────┬─────────┘    │ WebSocket
          │ HTTP         │ Real-time
          ↓              │
┌───────────────────┐    │
│   API Gateway     │    │
│   (Port 3001)     │    │
│ • Rate Limiting   │    │
│ • Swagger Docs    │    │
└─────────┬─────────┘    │
          │              │
    ┌─────┴─────┐        │
    ↓           ↓        │
┌─────────┐ ┌─────────┐ │
│  Auth   │ │  Tasks  │ │
│ Service │ │ Service │ │
│  :3002  │ │  :3003  │ │
└────┬────┘ └────┬────┘ │
     │           │       │
     │           ↓       │
     │      ┌──────────┐ │
     │      │ RabbitMQ │ │
     │      │  :5672   │ │
     │      └─────┬────┘ │
     │            ↓       │
     │      ┌─────────────┴─┐
     │      │ Notifications │
     │      │    Service    │
     │      │    :3004      │
     │      └───────────────┘
     ↓
┌──────────┐
│PostgreSQL│
│  :5432   │
└──────────┘
```

**Fluxo de Comunicação:**

1. **HTTP:** Frontend → Gateway → Auth/Tasks Services
2. **AMQP:** Tasks Service → RabbitMQ → Notifications Service
3. **WebSocket:** Notifications Service → Frontend (tempo real)

---

## 🚀 Quick Start

### Pré-requisitos

- Docker 24+ e Docker Compose 2.20+
- 8GB RAM disponível
- Portas livres: 3000-3004, 5432, 5672, 15672

### Executar o Projeto

```bash
# Clone o repositório
git clone <repository-url>
cd project

# Inicie todos os serviços
./start.sh

# OU manualmente:
docker-compose up --build -d

# Aguarde ~60 segundos para inicialização
```

### Acessar Aplicação

- 🌐 **Frontend**: http://localhost:3000
- 📚 **API Docs (Gateway)**: http://localhost:3001/docs
- 📚 **API Docs (Auth)**: http://localhost:3002/docs
- 📚 **API Docs (Tasks)**: http://localhost:3003/docs
- 🐰 **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Primeiro Uso

1. Acesse http://localhost:3000
2. Clique em **"Registrar"**
3. Crie uma conta (email + senha)
4. Crie sua primeira tarefa
5. Observe notificações em tempo real (ícone Wifi verde)

---

## 🎨 Tecnologias Principais

### Backend

| Tecnologia          | Versão | Uso                 |
| ------------------- | ------ | ------------------- |
| **NestJS**          | 11.0   | Framework backend   |
| **TypeORM**         | 0.3.28 | ORM para PostgreSQL |
| **Passport JWT**    | 10.0   | Autenticação        |
| **Socket.IO**       | 4.8    | WebSocket server    |
| **RabbitMQ**        | 3.13   | Message broker      |
| **class-validator** | 0.15   | Validação DTOs      |

### Frontend

| Tecnologia          | Versão | Uso                    |
| ------------------- | ------ | ---------------------- |
| **React**           | 19.2   | UI library             |
| **TanStack Router** | 1.132  | Roteamento type-safe   |
| **Tailwind CSS**    | 4.0    | Estilização            |
| **shadcn/ui**       | Latest | Componentes UI         |
| **Zod**             | 3.25   | Validação schemas      |
| **react-hook-form** | 7.68   | Gerenciamento de forms |

### Infraestrutura

| Tecnologia     | Versão | Uso             |
| -------------- | ------ | --------------- |
| **Docker**     | 24+    | Containerização |
| **PostgreSQL** | 17     | Banco de dados  |
| **Turborepo**  | Latest | Monorepo        |

---

## 💡 Decisões Técnicas

### 1. Arquitetura de Microserviços

**Escolha:** Separação em 4 serviços independentes.  
**Benefícios:**

- Escalabilidade independente por serviço
- Isolamento de falhas e deploy independente
- Facilita manutenção e evolução do sistema

### 2. RabbitMQ para Comunicação Assíncrona

**Escolha:** Message broker entre Tasks e Notifications.  
**Benefícios:**

- Desacoplamento total entre serviços
- Garantia de entrega de mensagens
- Performance: tasks não bloqueiam aguardando notificações

### 3. WebSocket com Socket.IO

**Escolha:** Notificações push em tempo real.  
**Benefícios:**

- Experiência de usuário superior (sem polling)
- Reconexão automática em caso de queda
- Fallback para long-polling quando necessário

### 4. JWT Stateless

**Escolha:** Autenticação sem sessões no servidor.  
**Benefícios:**

- Escalabilidade horizontal sem sticky sessions
- Tokens validáveis em qualquer instância
- Padrão da indústria amplamente suportado

### 5. Monorepo com Turborepo

**Escolha:** Código unificado para todos os serviços.  
**Benefícios:**

- Compartilhamento de types e configs
- Build cache para desenvolvimento rápido
- Refactoring cross-service simplificado

### 6. shadcn/ui + Tailwind

**Escolha:** Componentes copy-paste ao invés de bibliotecas externas.  
**Benefícios:**

- Customização total do código
- Bundle size otimizado (apenas o que é usado)
- Sem lock-in de bibliotecas de terceiros

---

## ⚙️ Funcionalidades Implementadas

### Autenticação & Autorização

- ✅ Registro e login com JWT
- ✅ Refresh tokens (7 dias de validade)
- ✅ Protected routes com Guards
- ✅ Bcrypt para hashing de senhas (10 rounds)

### Gerenciamento de Tarefas

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Filtros: status, prioridade, atribuído a, vencidas
- ✅ Busca por título/descrição
- ✅ Sistema de comentários em tasks
- ✅ Atribuição de executores
- ✅ Timestamps automáticos (createdAt, updatedAt)

### Notificações em Tempo Real

- ✅ Eventos: task criada, atualizada, deletada, comentário adicionado
- ✅ Indicador visual de conexão WebSocket
- ✅ Reconexão automática
- ✅ JWT authentication no handshake WebSocket

### UI/UX

- ✅ 16 componentes shadcn/ui customizados
- ✅ Visualização Grid e Kanban board
- ✅ Skeleton loaders com shimmer effect
- ✅ Toast notifications para feedback
- ✅ Dark mode badges por prioridade/status
- ✅ Formulários validados com Zod
- ✅ Interface responsiva

### Infraestrutura

- ✅ 7 containers Docker orquestrados
- ✅ Health checks em todos os serviços
- ✅ Rate limiting (10 req/seg por IP)
- ✅ CORS configurado corretamente
- ✅ Swagger docs em todos os microserviços
- ✅ Migrations TypeORM para versionamento de DB

---

## 📈 Melhorias Futuras

### Curto Prazo

- TanStack Query para cache otimizado
- Logger estruturado (Winston) com níveis de log
- Aumentar cobertura de testes (target: 80%+)
- CI/CD com GitHub Actions

### Médio Prazo

- Autenticação OAuth2 (Google, GitHub)
- Upload de anexos em tasks (S3/MinIO)
- Dashboard de analytics e relatórios
- Busca full-text com Elasticsearch

### Longo Prazo

- Migração para Kubernetes com Helm charts
- Observabilidade (Prometheus, Grafana, Jaeger)
- Redis cache layer para performance
- Mobile app com React Native

---

## ⏱️ Tempo de Desenvolvimento

**Total:** ~80 horas em 2 semanas (~6h/dia)

### Distribuição por Fase

**Semana 1 - Infraestrutura (50h):**

- Docker Compose com 7 containers
- Networking entre microserviços
- PostgreSQL + TypeORM setup
- RabbitMQ producer/consumer
- Auth Service com JWT
- Debugging e health checks

**Semana 2 - Features (30h):**

- Tasks Service completo (CRUD + comentários)
- WebSocket Gateway + notificações
- API Gateway com rate limiting
- Frontend React com shadcn/ui
- Formulários com validação Zod
- Polish de UX e animações

### Distribuição por Área

- 🐳 **Docker/Infra:** 62% (~50h)
- 🛠️ **Backend:** 24% (~19h)
- ⚛️ **Frontend:** 14% (~11h)

---

## 📚 Swagger API Documentation

Todos os endpoints estão documentados com Swagger/OpenAPI:

**API Gateway:** http://localhost:3001/docs

```
POST   /api/auth/register    - Registrar novo usuário
POST   /api/auth/login       - Login e obter tokens
GET    /api/auth/profile     - Perfil do usuário autenticado
POST   /api/auth/refresh     - Refresh access token

GET    /api/tasks            - Listar todas as tasks
POST   /api/tasks            - Criar nova task
GET    /api/tasks/:id        - Obter task específica
PATCH  /api/tasks/:id        - Atualizar task
DELETE /api/tasks/:id        - Deletar task
POST   /api/tasks/:id/comments - Adicionar comentário
```

**Auth Service:** http://localhost:3002/docs  
**Tasks Service:** http://localhost:3003/docs

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Com coverage
npm run test:cov

# Modo watch (desenvolvimento)
npm run test:watch

# Testes por serviço
cd apps/auth-service && npm test
cd apps/tasks-service && npm test
cd apps/api-gateway && npm test
```

---

## 🔧 Scripts Úteis

```bash
# Iniciar todos os serviços
./start.sh

# Verificar health de containers
./health-check.sh

# Testar API manualmente
./test-api.sh

# Parar todos os serviços
docker-compose down

# Ver logs de um serviço específico
docker logs -f auth-service
docker logs -f tasks-service

# Rebuild completo
docker-compose down -v
docker-compose up --build
```

---

## 📝 Variáveis de Ambiente

Principais configurações em [docker-compose.yml](docker-compose.yml):

```env
# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=jungle_user
POSTGRES_PASSWORD=jungle_pass
POSTGRES_DB=challenge_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Services URLs
AUTH_SERVICE_URL=http://auth-service:3002
TASKS_SERVICE_URL=http://tasks-service:3003
```

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---
