# Diagrama de Arquitetura As-Is (Atual)

## Diagrama da Arquitetura Atual

```mermaid
graph TB
    %% Frontend
    subgraph "Frontend (React + Vite)"
        WEB[🌐 Web App<br/>Porta: 3000<br/>React + TypeScript + Vite]
    end

    %% API Gateway
    subgraph "Backend Services"
        subgraph "API Gateway"
            GATEWAY[🚪 API Gateway<br/>Porta: 3001<br/>NestJS]
        end

        subgraph "Auth Service"
            AUTH[🔐 Auth Service<br/>Porta: 3002<br/>NestJS + TypeORM<br/>- Users Controller<br/>- Users Service<br/>- Database Entities]
        end

        subgraph "Tasks Service"
            TASKS[📋 Tasks Service<br/>Porta: 3003<br/>NestJS]
        end

        subgraph "Notifications Service"
            NOTIF[🔔 Notifications Service<br/>Porta: 3004<br/>NestJS<br/>- WebSocket Gateway]
        end
    end

    %% Database
    subgraph "Data Layer"
        subgraph "PostgreSQL"
            DB[(🗄️ PostgreSQL<br/>Porta: 5432<br/>Database: challenge-db)]
        end

        subgraph "Message Broker"
            RABBIT[📨 RabbitMQ<br/>Porta: 5672 (AMQP)<br/>Porta: 15672 (Management)<br/>User: admin/admin]
        end
    end

    %% External Dependencies
    subgraph "Infrastructure"
        DOCKER[🐳 Docker<br/>Container Runtime]
        TURBO[⚡ Turbo<br/>Monorepo Manager]
    end

    %% Connections
    WEB -->|HTTP Requests| GATEWAY
    GATEWAY -->|Routes| AUTH
    GATEWAY -->|Routes| TASKS
    GATEWAY -->|Routes| NOTIF

    AUTH -->|TypeORM| DB
    TASKS -->|Future| DB
    NOTIF -->|WebSocket| WEB
    NOTIF -->|AMQP| RABBIT
    AUTH -->|AMQP| RABBIT
    TASKS -->|AMQP| RABBIT

    %% Infrastructure Dependencies
    GATEWAY -.->|Docker Container| DOCKER
    AUTH -.->|Docker Container| DOCKER
    TASKS -.->|Docker Container| DOCKER
    NOTIF -.->|Docker Container| DOCKER
    WEB -.->|Docker Container| DOCKER
    DB -.->|Docker Container| DOCKER
    RABBIT -.->|Docker Container| DOCKER

    %% Monorepo
    WEB -.->|Monorepo| TURBO
    GATEWAY -.->|Monorepo| TURBO
    AUTH -.->|Monorepo| TURBO
    TASKS -.->|Monorepo| TURBO
    NOTIF -.->|Monorepo| TURBO

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef auth fill:#e8f5e8
    classDef tasks fill:#fff3e0
    classDef notifications fill:#fce4ec
    classDef database fill:#f1f8e9
    classDef infrastructure fill:#f5f5f5

    class WEB frontend
    class GATEWAY gateway
    class AUTH auth
    class TASKS tasks
    class NOTIF notifications
    class DB,RABBIT database
    class DOCKER,TURBO infrastructure
```

## Análise da Arquitetura Atual

### Componentes Principais

#### 1. **Frontend (Web App)**

- **Tecnologia**: React + TypeScript + Vite
- **Porta**: 3000
- **Responsabilidade**: Interface do usuário, comunicação com API Gateway
- **Status**: Configurado e pronto para desenvolvimento

#### 2. **API Gateway**

- **Tecnologia**: NestJS
- **Porta**: 3001
- **Responsabilidade**: Roteamento de requisições para serviços backend
- **Status**: Estrutura básica implementada

#### 3. **Auth Service**

- **Tecnologia**: NestJS + TypeORM + PostgreSQL
- **Porta**: 3002
- **Responsabilidade**:
  - Autenticação e autorização
  - Gerenciamento de usuários
  - Entidade User com TypeORM
- **Status**: Mais desenvolvido, com database configurado

#### 4. **Tasks Service**

- **Tecnologia**: NestJS
- **Porta**: 3003
- **Responsabilidade**: Gerenciamento de tarefas (planejado)
- **Status**: Estrutura básica implementada

#### 5. **Notifications Service**

- **Tecnologia**: NestJS + WebSocket
- **Porta**: 3004
- **Responsabilidade**:
  - Notificações em tempo real
  - WebSocket Gateway para comunicação bidirecional
- **Status**: Estrutura básica com WebSocket configurado

#### 6. **Banco de Dados**

- **Tecnologia**: PostgreSQL 17.5
- **Porta**: 5432
- **Responsabilidade**: Persistência de dados
- **Configuração**:
  - Database: challenge-db
  - Usuário: postgres
  - Senha: password

#### 7. **Message Broker**

- **Tecnologia**: RabbitMQ 3.13
- **Portas**: 5672 (AMQP), 15672 (Management UI)
- **Responsabilidade**: Comunicação assíncrona entre serviços
- **Configuração**:
  - Usuário: admin
  - Senha: admin

### Infraestrutura

#### **Docker**

- Todos os serviços containerizados
- Network isolada: `challenge-network`
- Volumes persistentes para banco de dados e RabbitMQ

#### **Turbo (Monorepo)**

- Gerenciamento de múltiplos pacotes
- Scripts otimizados para build e desenvolvimento
- Workspaces organizados em `apps/` e `packages/`

### Fluxo de Dados Atual

1. **Frontend → API Gateway**: Requisições HTTP
2. **API Gateway → Services**: Roteamento para auth, tasks, notifications
3. **Auth Service → PostgreSQL**: Persistência de usuários
4. **Services → RabbitMQ**: Comunicação assíncrona (planejado)
5. **Notifications Service → Frontend**: WebSocket para notificações em tempo real

### Estado Atual do Projeto

#### ✅ **Implementado**

- Estrutura de monorepo com Turbo
- Docker-compose com todos os serviços
- Auth Service com database configurado
- Notifications Service com WebSocket
- Frontend React configurado
- API Gateway básico

#### 🔄 **Em Desenvolvimento**

- Integração completa entre serviços
- Implementação da lógica de negócios
- Configuração de rotas no API Gateway

#### 📋 **Planejado**

- Funcionalidades do Tasks Service
- Integração com RabbitMQ
- Autenticação JWT
- Testes automatizados
- Documentação da API

### Tecnologias Utilizadas

| Categoria          | Tecnologia | Versão |
| ------------------ | ---------- | ------ |
| **Frontend**       | React      | 18+    |
|                    | TypeScript | 5.9.2  |
|                    | Vite       | Latest |
| **Backend**        | NestJS     | Latest |
|                    | TypeORM    | 0.3.28 |
| **Database**       | PostgreSQL | 17.5   |
| **Message Broker** | RabbitMQ   | 3.13   |
| **Infraestrutura** | Docker     | Latest |
|                    | Turbo      | 2.6.3  |
|                    | npm        | 11.4.1 |

Esta arquitetura segue os princípios de microservices, com serviços especializados e comunicação através de API Gateway e message broker.
