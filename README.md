# 🎮 Jungle Gaming - Task Management System

> Sistema colaborativo de gerenciamento de tarefas em tempo real baseado em arquitetura de microserviços.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Quick Start](#-quick-start)
- [Decisões Técnicas](#-decisões-técnicas-e-trade-offs)
- [Problemas Conhecidos](#-problemas-conhecidos-e-melhorias-futuras)
- [Tempo de Desenvolvimento](#-tempo-de-desenvolvimento)
- [Tecnologias](#-tecnologias-principais)
- [Documentação](#-documentação)

---

## 🎯 Visão Geral

Sistema completo de gestão de tarefas desenvolvido com arquitetura de microserviços, focado em colaboração em tempo real e escalabilidade. Implementa autenticação JWT, notificações WebSocket, validação robusta e interface moderna.

**Principais Funcionalidades:**

- ✅ Autenticação JWT com refresh tokens
- ✅ CRUD completo de tarefas com filtros avançados
- ✅ Sistema de comentários em tarefas
- ✅ Notificações em tempo real via WebSocket
- ✅ Visualização Grid e Kanban
- ✅ Rate limiting e proteção contra DDoS
- ✅ Validação forte com Zod e class-validator
- ✅ UI moderna com Tailwind CSS e shadcn/ui

---

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 19 + TanStack Router + Tailwind CSS + shadcn/ui  │  │
│  │  • Context API (Auth)                                    │  │
│  │  • Socket.IO Client (WebSocket)                          │  │
│  │  • react-hook-form + Zod (Validação)                     │  │
│  │  • Skeleton Loaders + Toast Notifications                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│                        PORT: 3000                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP + WebSocket
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Proxy HTTP para microserviços                         │  │
│  │  • Rate Limiting (ThrottlerModule - 10 req/seg)          │  │
│  │  • Swagger Documentation (/docs)                         │  │
│  │  • Global Error Handling                                 │  │
│  │  • CORS Configuration                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        PORT: 3001                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                 ┌────────────┴────────────┐
                 ↓                         ↓
┌─────────────────────────────┐  ┌─────────────────────────────┐
│   AUTH SERVICE (NestJS)     │  │   TASKS SERVICE (NestJS)    │
│  ┌──────────────────────┐   │  │  ┌──────────────────────┐   │
│  │ • JWT Auth (Passport)│   │  │  │ • CRUD Tarefas       │   │
│  │ • Bcrypt Password    │   │  │  │ • RabbitMQ Producer  │   │
│  │ • User Management    │   │  │  │ • TypeORM Entities   │   │
│  │ • Token Refresh      │   │  │  │ • Comentários        │   │
│  │ • Swagger /docs      │   │  │  │ • Swagger /docs      │   │
│  └──────────────────────┘   │  │  └──────────────────────┘   │
│       PORT: 3002             │  │       PORT: 3003            │
└──────────────┬───────────────┘  └──────────────┬──────────────┘
               │                                  │
               └──────────────┬───────────────────┘
                              ↓
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │  ┌────────────┐  │
                    │  │ Database:  │  │
                    │  │ challenge- │  │
                    │  │    db      │  │
                    │  └────────────┘  │
                    │   PORT: 5432     │
                    └──────────────────┘
                              ↑
                              │
                    TypeORM Migrations
                              │
               ┌──────────────┴───────────────┐
               ↓                              ↓
      ┌──────────────┐              ┌──────────────┐
      │    TASKS     │              │  AUTH/USERS  │
      │  RabbitMQ    │              │   TypeORM    │
      │  Producer    │              │   Entities   │
      └──────┬───────┘              └──────────────┘
             │
             │ AMQP Protocol
             ↓
   ┌─────────────────────┐
   │     RabbitMQ        │
   │  ┌──────────────┐   │
   │  │   Queue:     │   │
   │  │ notifications│   │
   │  │   -queue     │   │
   │  └──────────────┘   │
   │   PORT: 5672        │
   │   MGMT: 15672       │
   └─────────┬───────────┘
             │
             │ AMQP Consumer
             ↓
┌────────────────────────────────────┐
│ NOTIFICATIONS SERVICE (NestJS)     │
│  ┌──────────────────────────────┐  │
│  │ • WebSocket Gateway          │  │
│  │ • Socket.IO Server           │  │
│  │ • RabbitMQ Consumer          │  │
│  │ • JWT Authentication         │  │
│  │ • Real-time Events:          │  │
│  │   - TASK_CREATED             │  │
│  │   - TASK_UPDATED             │  │
│  │   - TASK_DELETED             │  │
│  │   - COMMENT_ADDED            │  │
│  └──────────────────────────────┘  │
│           PORT: 3004                │
└─────────────────────────────────────┘
             ↑
             │ WebSocket Connection
             │
        [Frontend]
```

### Fluxo de Dados

**1. Autenticação:**

```
Frontend → API Gateway → Auth Service → PostgreSQL
                          ↓
                    JWT Token (Access + Refresh)
                          ↓
                      Frontend
```

**2. Criação de Tarefa:**

```
Frontend → API Gateway → Tasks Service → PostgreSQL
                              ↓
                         RabbitMQ (publish event)
                              ↓
                    Notifications Service
                              ↓
                    WebSocket → Frontend (real-time update)
```

**3. Notificações em Tempo Real:**

```
Tasks Service → RabbitMQ → Notifications Service → WebSocket → Frontend
```

---

## 🚀 Quick Start

### Pré-requisitos

- **Docker** 24+ e **Docker Compose** 2.20+
- **Node.js** 20+ (apenas para desenvolvimento local)
- **Git**
- **8GB RAM** mínimo disponível
- **Portas livres:** 3000-3004, 5432, 5672, 15672

### Iniciando o Projeto (Modo Produção)

```bash
# 1. Clone o repositório
git clone <repository-url>
cd project

# 2. Inicie todos os serviços com Docker
./start.sh

# OU manualmente:
docker-compose up --build -d

# 3. Aguarde ~60 segundos para health checks

# 4. Verifique status dos containers
docker ps

# 5. Acesse a aplicação
```

**URLs de Acesso:**

- 🌐 **Frontend**: http://localhost:3000
- 🚪 **API Gateway**: http://localhost:3001
- 📚 **Swagger API Gateway**: http://localhost:3001/docs
- 🔐 **Auth Service Swagger**: http://localhost:3002/docs
- 📋 **Tasks Service Swagger**: http://localhost:3003/docs
- 🐰 **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Primeiro Acesso

1. Abra http://localhost:3000
2. Clique na aba **"Registrar"**
3. Crie uma conta com email e senha
4. Você será automaticamente logado
5. Crie sua primeira tarefa clicando em **"Nova Tarefa"**
6. Observe o ícone **Wifi verde** indicando conexão WebSocket ativa

---

## 🧠 Decisões Técnicas e Trade-offs

### 1. **Arquitetura de Microserviços**

**Decisão:** Separar a aplicação em 4 microserviços (Gateway, Auth, Tasks, Notifications).

**Justificativa:**

- ✅ **Escalabilidade independente**: Cada serviço pode escalar conforme demanda
- ✅ **Isolamento de falhas**: Problema em um serviço não derruba o sistema inteiro
- ✅ **Tecnologia agnóstica**: Cada serviço pode usar stack diferente no futuro
- ✅ **Deployment independente**: Deploy de um serviço não afeta os outros

**Trade-offs:**

- ❌ **Complexidade operacional**: Mais containers para gerenciar
- ❌ **Latência adicional**: Comunicação HTTP entre serviços adiciona overhead
- ❌ **Debugging mais difícil**: Rastreamento de erros entre múltiplos serviços

**Por que valeu a pena:** Para um sistema colaborativo em tempo real com potencial de crescimento, a escalabilidade e isolamento justificam a complexidade adicional.

---

### 2. **RabbitMQ para Comunicação Assíncrona**

**Decisão:** Usar RabbitMQ como message broker entre Tasks Service e Notifications Service.

**Justificativa:**

- ✅ **Desacoplamento**: Tasks Service não precisa conhecer Notifications Service
- ✅ **Resiliência**: Se Notifications cair, mensagens ficam na fila
- ✅ **Performance**: Tasks Service responde imediatamente sem esperar notificações
- ✅ **Escalabilidade**: Múltiplos consumers podem processar notificações

**Trade-offs:**

- ❌ **Infraestrutura adicional**: Um container extra para gerenciar
- ❌ **Consistência eventual**: Notificações podem demorar alguns milissegundos
- ❌ **Complexidade de debugging**: Mensagens assíncronas são mais difíceis de rastrear

**Alternativas consideradas:**

- **HTTP direto**: Mais simples, mas cria acoplamento forte
- **Redis Pub/Sub**: Mais leve, mas sem garantia de entrega
- **Kafka**: Overkill para o volume esperado

**Por que RabbitMQ:** Equilíbrio perfeito entre confiabilidade, facilidade de uso e features necessárias para o projeto.

---

### 3. **WebSocket (Socket.IO) para Notificações em Tempo Real**

**Decisão:** Usar Socket.IO no Notifications Service para push de notificações.

**Justificativa:**

- ✅ **Tempo real**: Notificações instantâneas sem polling
- ✅ **Bidirecional**: Servidor pode enviar mensagens sem request
- ✅ **Reconexão automática**: Socket.IO gerencia reconexões
- ✅ **Fallback**: Automaticamente usa long-polling se WebSocket não disponível

**Trade-offs:**

- ❌ **Estado**: WebSocket é stateful, dificulta escalabilidade horizontal
- ❌ **Compatibilidade**: Requer configuração específica de CORS
- ❌ **Debugging**: Mais difícil rastrear problemas de conexão

**Alternativas consideradas:**

- **Server-Sent Events (SSE)**: Unidirecional, sem suporte a mensagens do cliente
- **Long Polling**: Simples, mas ineficiente e alto uso de recursos
- **gRPC Streaming**: Overkill e complexidade desnecessária

**Por que Socket.IO:** Padrão da indústria para real-time, com excelente suporte e ecosystem.

---

### 4. **JWT com Passport para Autenticação**

**Decisão:** Usar JWT tokens com estratégia Passport no NestJS.

**Justificativa:**

- ✅ **Stateless**: Não requer sessões no servidor
- ✅ **Escalabilidade**: Tokens podem ser validados em qualquer instância
- ✅ **Padrão da indústria**: Amplamente aceito e documentado
- ✅ **Integração fácil**: Passport tem ótima integração com NestJS

**Trade-offs:**

- ❌ **Revogação**: Não é possível invalidar tokens antes do expiry
- ❌ **Tamanho**: Tokens JWT são maiores que session IDs
- ❌ **Segurança**: Se a secret vazar, todos os tokens ficam comprometidos

**Decisões de segurança implementadas:**

- ✅ Access tokens com 15 minutos de expiração
- ✅ Refresh tokens com 7 dias
- ✅ Bcrypt com salt de 10 rounds para passwords
- ✅ JWT secrets em variáveis de ambiente

**Por que JWT:** Para arquitetura de microserviços, stateless authentication é essencial para escalabilidade.

---

### 5. **React 19 + TanStack Router (sem Next.js)**

**Decisão:** Usar React puro com TanStack Router ao invés de framework full-stack.

**Justificativa:**

- ✅ **Controle total**: Sem abstrações do Next.js
- ✅ **Bundle menor**: Apenas o necessário
- ✅ **Type-safe routing**: TanStack Router oferece rotas tipadas
- ✅ **Simplicidade**: Frontend separado do backend

**Trade-offs:**

- ❌ **Sem SSR**: Sem Server-Side Rendering
- ❌ **Sem file-based routing**: Rotas configuradas manualmente
- ❌ **SEO**: Pior otimização para motores de busca

**Por que não Next.js:** Projeto é um dashboard interno (não precisa de SEO), e separação clara frontend/backend simplifica arquitetura de microserviços.

---

### 6. **shadcn/ui ao invés de MUI ou Ant Design**

**Decisão:** Usar shadcn/ui + Tailwind CSS para componentes.

**Justificativa:**

- ✅ **Copy-paste components**: Código fica no projeto, sem dependência externa
- ✅ **Customização total**: Componentes são editáveis
- ✅ **Bundle size**: Apenas componentes usados são incluídos
- ✅ **Design moderno**: Estética limpa e profissional

**Trade-offs:**

- ❌ **Manutenção**: Componentes precisam ser atualizados manualmente
- ❌ **Menos componentes**: Biblioteca menor que MUI
- ❌ **Menos exemplos**: Comunidade menor

**Por que shadcn/ui:** Controle total sobre UI, bundle pequeno e design moderno alinham perfeitamente com os requisitos do projeto.

---

### 7. **TypeORM ao invés de Prisma**

**Decisão:** Usar TypeORM como ORM.

**Justificativa:**

- ✅ **Integração nativa NestJS**: `@nestjs/typeorm` é primeira classe
- ✅ **Decorators**: Sintaxe familiar para desenvolvedores NestJS
- ✅ **Migrations automáticas**: Geração de migrations a partir de entities
- ✅ **Active Record pattern**: Mais simples para CRUD básico

**Trade-offs:**

- ❌ **Type-safety menor**: Prisma tem melhor inferência de tipos
- ❌ **Performance**: Prisma gera queries mais otimizadas
- ❌ **Developer Experience**: Prisma Studio é superior

**Por que TypeORM:** Integração perfeita com NestJS e padrão Decorator facilitam desenvolvimento e manutenção.

---

### 8. **Docker Compose ao invés de Kubernetes**

**Decisão:** Usar Docker Compose para orquestração.

**Justificativa:**

- ✅ **Simplicidade**: Um arquivo YAML vs múltiplos manifestos K8s
- ✅ **Desenvolvimento local**: Fácil rodar localmente
- ✅ **Sem overhead**: Não precisa de cluster K8s
- ✅ **Custo zero**: Roda em qualquer máquina com Docker

**Trade-offs:**

- ❌ **Sem auto-scaling**: Não escala automaticamente
- ❌ **Sem self-healing**: Containers crashados precisam restart manual
- ❌ **Produção**: Não é ideal para produção em larga escala

**Quando migrar para K8s:** Quando tiver >10 containers, múltiplos ambientes (staging/prod), ou necessidade de auto-scaling.

**Por que Docker Compose:** Para MVP e desenvolvimento, simplicidade > features enterprise.

---

### 9. **Monorepo com Turborepo**

**Decisão:** Organizar projeto como monorepo ao invés de multi-repo.

**Justificativa:**

- ✅ **Código compartilhado**: Types, configs e UI components reutilizáveis
- ✅ **Deploy atômico**: Todas as mudanças em um commit
- ✅ **Refactoring fácil**: Mudanças cross-service são simples
- ✅ **Build cache**: Turborepo cacheia builds para velocidade

**Trade-offs:**

- ❌ **Repository grande**: Um repo com todo o código
- ❌ **CI/CD complexo**: Precisa detectar mudanças por app
- ❌ **Permissões**: Não é possível dar acesso granular por serviço

**Por que Monorepo:** Para time pequeno e projeto inicial, benefícios de código compartilhado superam complexidade de multi-repo.

---

### 10. **Zod + react-hook-form ao invés de Formik**

**Decisão:** Usar react-hook-form com Zod para validação de formulários.

**Justificativa:**

- ✅ **Type-safety**: Zod gera tipos TypeScript automaticamente
- ✅ **Performance**: react-hook-form renderiza menos que Formik
- ✅ **Schema reutilizável**: Zod schemas podem ser usados no backend
- ✅ **Bundle size**: Menor que Formik + Yup

**Trade-offs:**

- ❌ **Curva de aprendizado**: Sintaxe Zod é menos intuitiva que Yup
- ❌ **Menos exemplos**: Comunidade menor que Formik

**Por que react-hook-form + Zod:** Performance superior e type-safety completa justificam a curva de aprendizado.

---

## 🐛 Problemas Conhecidos e Melhorias Futuras

### Problemas Conhecidos

#### 1. **TanStack Query instalado mas não usado**

**Problema:** Biblioteca está em `package.json` mas código usa `fetch()` manual.

**Impacto:** ⚠️ Baixo

- Cache não otimizado
- Refetch manual necessário
- Código mais verboso

**Solução proposta:**

```typescript
// Atual (fetch manual)
const fetchTasks = async () => {
  const response = await fetch(`${apiUrl}/tasks`);
  const data = await response.json();
  setTasks(data);
};

// Ideal (TanStack Query)
const {
  data: tasks,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["tasks"],
  queryFn: () => fetchTasks(),
  staleTime: 30000,
});
```

**Tempo estimado:** 2-3 horas

---

#### 2. **Logging estruturado ausente**

**Problema:** Apenas `console.log()` usado, sem logger estruturado (Winston/Pino).

**Impacto:** ⚠️ Médio (em produção)

- Dificulta debugging em produção
- Sem níveis de log (info, warn, error)
- Sem formatação JSON para agregadores de log

**Solução proposta:**

```typescript
// Instalar Winston
npm install winston

// Configurar em main.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

app.useLogger(WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
}));
```

**Tempo estimado:** 1-2 horas

---

#### 3. **Cobertura de testes baixa (~10%)**

**Problema:** Apenas testes básicos implementados, falta cobertura real.

**Impacto:** ⚠️ Alto (para CI/CD)

- Regressões não detectadas
- Dificulta refactoring seguro
- Deploy sem confiança

**O que falta:**

- Testes unitários para services (Tasks, Auth)
- Testes de integração para controllers
- Testes E2E com Supertest
- Testes de componentes React com Testing Library

**Tempo estimado:** 8-12 horas

---

#### 4. **Sem CI/CD pipeline**

**Problema:** Deploy e testes são manuais.

**Impacto:** ⚠️ Médio

- Erros só detectados após deploy
- Processo de release lento
- Sem automação de build

**Solução proposta:**

- GitHub Actions para CI
- Testes automáticos em PR
- Build e deploy automático
- Lint e type-check em pipeline

**Tempo estimado:** 4-6 horas

---

#### 5. **Sem health check endpoint no API Gateway**

**Problema:** Gateway não expõe endpoint `/health` para monitoring.

**Impacto:** ⚠️ Baixo

- Dificulta monitoramento em produção
- Load balancers não sabem se serviço está saudável

**Solução:**

```typescript
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

**Tempo estimado:** 30 minutos

---

#### 6. **Tokens JWT não podem ser revogados**

**Problema:** Uma vez emitido, token é válido até expirar (15 min).

**Impacto:** ⚠️ Médio (segurança)

- Não é possível fazer logout instantâneo
- Tokens comprometidos continuam válidos
- Sem blacklist de tokens

**Soluções possíveis:**

1. **Redis blacklist**: Armazenar tokens revogados
2. **Refresh token rotation**: Invalidar refresh tokens
3. **Short-lived tokens**: Reduzir expiração para 5 min

**Tempo estimado:** 3-4 horas

---

### Melhorias Futuras (Roadmap)

#### Curto Prazo (1-2 semanas)

1. **Implementar TanStack Query**
   - Substituir fetch manual
   - Cache automático
   - Refetch otimizado
   - Loading states gerenciados

2. **Adicionar Winston Logger**
   - Logs estruturados em JSON
   - Níveis de log (info, warn, error, debug)
   - Rotação de arquivos de log
   - Integração com ELK Stack

3. **Aumentar cobertura de testes**
   - Target: 80%+ coverage
   - Testes unitários completos
   - Testes E2E com Supertest
   - Testes de componentes React

4. **Setup CI/CD**
   - GitHub Actions
   - Testes automáticos
   - Build e deploy automático
   - Code quality gates

---

#### Médio Prazo (1-2 meses)

5. **Autenticação Social**
   - Login com Google
   - Login com GitHub
   - OAuth2 flow

6. **Notificações Push**
   - Service Workers
   - Push notifications no browser
   - Notificações desktop

7. **Upload de Arquivos**
   - Anexos em tarefas
   - Storage com S3/MinIO
   - Preview de imagens

8. **Relatórios e Analytics**
   - Dashboard de métricas
   - Gráficos de produtividade
   - Export para PDF

9. **Busca Avançada**
   - Full-text search com Elasticsearch
   - Filtros complexos
   - Busca fuzzy

10. **Temas e Personalização**
    - Dark mode
    - Temas customizáveis
    - Preferências do usuário

---

#### Longo Prazo (3-6 meses)

11. **Migração para Kubernetes**
    - Manifests K8s
    - Helm charts
    - Auto-scaling
    - Self-healing

12. **Observabilidade Completa**
    - Prometheus + Grafana
    - Jaeger para tracing distribuído
    - ELK Stack para logs
    - Alerting com AlertManager

13. **Performance Optimization**
    - Redis cache layer
    - Database query optimization
    - CDN para assets estáticos
    - Code splitting no frontend

14. **Multi-tenancy**
    - Suporte a múltiplas organizações
    - Isolamento de dados
    - Billing por tenant

15. **Mobile App**
    - React Native
    - Notificações push nativas
    - Modo offline

---

## ⏱️ Tempo de Desenvolvimento

### Resumo Executivo

**Tempo Total:** ~80 horas distribuídas em **2 semanas** (14 dias)

### Breakdown por Fase

#### Semana 1: Estruturação Docker e Microserviços (Dias 1-7)

**Tempo:** ~50 horas

Esta foi a fase mais desafiadora do projeto, focada em estabelecer a infraestrutura base de microserviços e fazer tudo funcionar em conjunto.

| Tarefa                              | Tempo | Descrição                                             | Desafios Enfrentados                                |
| ----------------------------------- | ----- | ----------------------------------------------------- | --------------------------------------------------- |
| 🐳 **Docker Setup Inicial**         | 8h    | docker-compose.yml, Dockerfiles, networks, volumes    | Configuração de networks, volumes, healthchecks     |
| 🔗 **Conectividade entre Serviços** | 12h   | Comunicação HTTP entre containers, DNS interno        | Problemas de resolução de nomes, timeout, CORS      |
| 🗄️ **PostgreSQL Setup**             | 6h    | Container PostgreSQL, configuração TypeORM            | Sincronização de schemas, migrations, connections   |
| 🐰 **RabbitMQ Integration**         | 8h    | Container RabbitMQ, producer/consumer setup           | Configuração de filas, exchange, binding, reconnect |
| 🏗️ **Arquitetura de Microserviços** | 6h    | Definição de responsabilidades, separação de concerns | Decidir o que vai em cada serviço, dependencies     |
| 🔐 **Auth Service Base**            | 5h    | JWT implementation, Passport setup, user entities     | Configuração de secrets, token expiration, Guards   |
| 🐛 **Debugging & Troubleshooting**  | 5h    | Health checks, restart policies, logs, fixes          | curl não instalado, containers unhealthy, crashes   |

**Principais Obstáculos:**

- ❌ **Comunicação entre containers**: Levou ~8h para configurar corretamente DNS interno, network bridge e resolver timeouts
- ❌ **RabbitMQ Connection Manager**: 4h extras para entender amqp-connection-manager, configurar reconnect e garantir delivery
- ❌ **TypeORM Synchronize**: Problemas com sincronização automática, levou tempo para migrar para migrations
- ❌ **Health Checks**: Containers ficavam unhealthy constantemente, precisou instalar curl nos Dockerfiles Alpine
- ❌ **CORS Issues**: Configuração de CORS entre microserviços levou tempo e testes

#### Semana 2: Backend Completo, Frontend e Refinamentos (Dias 8-14)

**Tempo:** ~30 horas

Com a infraestrutura Docker estável, foco mudou para implementar todas as funcionalidades do sistema.

| Tarefa                           | Tempo | Descrição                                                | Desafios                               |
| -------------------------------- | ----- | -------------------------------------------------------- | -------------------------------------- |
| 📋 **Tasks Service Completo**    | 5h    | CRUD, DTOs, validação, comentários, assignments          | Relations complexas, cascade deletes   |
| 🔔 **Notifications + WebSocket** | 4h    | Socket.IO Gateway, events, JWT auth, RabbitMQ consumer   | CORS WebSocket, autenticação no socket |
| 🚪 **API Gateway**               | 2h    | Routing, forwarding, error handling, rate limiting       | Proxy correto, status code passthrough |
| 📚 **Swagger Documentation**     | 3h    | Swagger em todos os serviços, DTOs documentados          | Conflito de rotas, configuração Bearer |
| ⚛️ **React + Vite Setup**        | 2h    | Configuração inicial, TanStack Router, Tailwind, aliases | Configuração de paths, tsconfig        |
| 🎨 **UI Components**             | 4h    | shadcn/ui: Button, Card, Dialog, Badge, Skeleton, etc    | Customização de estilos, variants      |
| 🔐 **Authentication Flow**       | 3h    | Login/Register, Context API, protected routes, tokens    | Token refresh, auto-logout, storage    |
| 📋 **Tasks Interface**           | 3h    | Lista, filtros, modals, Kanban board, WebSocket updates  | State sync, filtros complexos          |
| ✅ **Validação com Zod**         | 2h    | Schemas Zod, react-hook-form em todos os forms           | Integration, error messages português  |
| 🎨 **Polish & UX**               | 2h    | Animações, loading states, toast notifications           | Framer Motion, skeleton timings        |

**Principais Obstáculos:**

- ❌ **WebSocket Authentication**: 2h extras para implementar JWT corretamente no handshake do Socket.IO
- ❌ **State Sync**: Sincronizar estado local com notificações WebSocket em tempo real (2h extras)
- ❌ **Form Validation**: Integrar react-hook-form + Zod corretamente em todos os formulários
- ❌ **JWT Strategy**: Conflito entre JWT_SECRET e JWT_ACCESS_SECRET causou bugs de autenticação
- ❌ **TypeORM Migrations**: Migration para adicionar executorId column teve problemas

### Distribuição de Tempo por Área

```
🐳 Docker + Infraestrutura     ███████████████████████░░  62% (~50h)
    • Setup Docker Compose (7 containers)
    • Network configuration e debugging
    • Service connectivity (HTTP + AMQP)
    • Health checks e restart policies
    • Debugging extensivo de containers

🛠️ Backend (NestJS + APIs)      ████████████░░░░░░░░░░░░  24% (~19h)
    • Auth Service (JWT, Passport, Guards)
    • Tasks Service (CRUD completo, TypeORM)
    • Notifications (WebSocket, RabbitMQ)
    • API Gateway (Proxy, Rate limit, Swagger)
    • DTOs com class-validator

⚛️ Frontend (React + UI)         ███████░░░░░░░░░░░░░░░░░  14% (~11h)
    • React setup + TanStack Router
    • shadcn/ui: 16 componentes
    • Forms com Zod validation
    • WebSocket integration
    • Kanban board, filtros, UX
```

### Timeline Cronológica

**📅 Semana 1 - Dias 1-3:** Docker Hell & Fundações

- Setup inicial do monorepo Turborepo
- Criação de 4 Dockerfiles para microserviços
- docker-compose.yml com 7 services (db, rabbitmq, 4 apps, web)
- **Problema crítico:** Containers não se comunicavam entre si (DNS interno)
- **Problema crítico:** RabbitMQ não conectava, reconnect infinito
- **Solução:** Configurar network bridge, usar service names, depends_on, healthchecks

**📅 Semana 1 - Dias 4-5:** Microserviços Conectados

- RabbitMQ configurado e funcionando (producer + consumer)
- PostgreSQL com TypeORM e migrations
- Auth Service com JWT + Passport + Guards
- Tasks Service CRUD básico
- **Problema crítico:** RabbitMQ consumer não recebia mensagens
- **Problema crítico:** TypeORM sincronização causava conflitos
- **Solução:** Configurar exchange e binding, migrar para migrations

**📅 Semana 1 - Dias 6-7:** Backend Base Completo

- WebSocket Gateway funcionando com Socket.IO
- API Gateway com proxy HTTP
- Health checks em todos os containers
- **Problema crítico:** Containers ficavam unhealthy
- **Problema crítico:** CORS bloqueando requests entre serviços
- **Solução:** Instalar curl nos Dockerfiles, configurar CORS em todos os services

**📅 Semana 2 - Dias 8-10:** Backend Refinamentos

- Tasks Service completo (comentários, assignments)
- Notifications Service com RabbitMQ consumer
- Swagger em todos os serviços (Gateway, Auth, Tasks)
- JWT Strategy e Guards implementados
- Rate limiting no Gateway (ThrottlerModule)
- **Problema crítico:** JWT Strategy não funcionava (JWT_SECRET vs JWT_ACCESS_SECRET)
- **Problema crítico:** Swagger conflitava com rotas catch-all do proxy
- **Solução:** Unificar secrets, mover Swagger setup antes de setGlobalPrefix

**📅 Semana 2 - Dias 11-12:** Frontend Sprint

- React app com Vite rodando
- TanStack Router configurado
- shadcn/ui: 16 componentes instalados
- Login/Register funcionando com Context API
- Tasks page com lista e filtros
- **Problema crítico:** CORS bloqueando requests do frontend
- **Problema crítico:** WebSocket não conectava do browser
- **Solução:** Configurar CORS origin correto, auth no Socket.IO handshake

**📅 Semana 2 - Dias 13-14:** Polish e Validação

- react-hook-form + Zod em todos os formulários (3 forms refatorados)
- Skeleton loaders com shimmer effect (animate-pulse)
- WebSocket notifications funcionando na UI (ícone Wifi)
- Kanban board view alternativa
- Filtros avançados (status, priority, overdue, search)
- **Problema crítico:** Validação não exibia erros corretamente
- **Problema crítico:** Task creation falhava (faltava executorId column)
- **Solução:** Refatorar forms para usar formState.errors, criar migration

### Lições Aprendidas

#### ✅ O que funcionou bem:

1. **Monorepo Turborepo**: Facilitou compartilhamento de código entre microserviços
2. **Docker Compose**: Simplificou desenvolvimento local apesar da curva de aprendizado
3. **NestJS**: Estrutura clara, módulos bem definidos, excelente documentação
4. **shadcn/ui**: Componentes prontos economizaram muito tempo no frontend
5. **TypeScript**: Detectou inúmeros bugs em tempo de desenvolvimento
6. **Swagger**: Documentação automática facilitou testes e debugging

#### ❌ O que levou muito mais tempo que o esperado:

1. **Docker Networking** (8h extras): Configuração de comunicação entre 7 containers
2. **RabbitMQ** (4h extras): Entender producer/consumer, exchange, queues, reconnect
3. **Health Checks** (3h extras): Fazer todos os containers ficarem healthy consistentemente
4. **CORS Configuration** (3h extras): Configurar CORS entre microserviços e frontend
5. **WebSocket + JWT** (2h extras): Autenticação no Socket.IO handshake
6. **TypeORM** (2h extras): Migrations vs synchronize, relations complexas

#### 🚀 O que faria diferente se começasse hoje:

1. **Começar com docker-compose simples**: Um container por vez, adicionar complexidade gradualmente
2. **Usar Prisma ao invés de TypeORM**: Melhor DX, type-safety, migrations mais simples
3. **Setup logging estruturado desde o início**: Winston/Pino facilitaria debugging
4. **Testes desde o começo**: Evitaria regressões, daria mais confiança nas mudanças
5. **CI/CD no início**: GitHub Actions para rodar testes e build automaticamente
6. **Estudar Docker networking antes**: Economizaria horas de debugging

### Tempo de Desenvolvimento vs Tempo Real

**Tempo de desenvolvimento efetivo:** ~80 horas  
**Período calendário:** 14 dias (2 semanas)  
**Horas por dia:** ~6 horas (média)

**Distribuição semanal:**

**Semana 1 (Infraestrutura - ~50h):**

- Segunda: 10h (Docker setup inicial, muitos erros)
- Terça: 8h (Networking e conectividade)
- Quarta: 7h (PostgreSQL + TypeORM)
- Quinta: 8h (RabbitMQ integration)
- Sexta: 6h (Auth Service base)
- Sábado: 7h (WebSocket + Gateway)
- Domingo: 4h (Debugging e health checks)

**Semana 2 (Funcionalidades - ~30h):**

- Segunda: 5h (Tasks Service completo)
- Terça: 4h (Swagger + documentação)
- Quarta: 4h (Frontend setup)
- Quinta: 5h (UI components + Auth)
- Sexta: 5h (Tasks interface)
- Sábado: 4h (Validação Zod + forms)
- Domingo: 3h (Polish final + testes)

**Reflexão:** A primeira semana foi extremamente desafiadora devido à complexidade de fazer 7 containers Docker funcionarem em conjunto com comunicação HTTP, AMQP e WebSocket. A segunda semana foi mais produtiva pois a base estava sólida.

- Terça: 6h (Conectividade)
- Quarta: 5h (Backend core)
- Quinta: 4h (Integrações)
- Sexta: 6h (WebSocket + Gateway)
- Sábado: 7h (Frontend)
- Domingo: 4h (Polish + validação)

---

## 📋 Estrutura do Projeto

```
project/
├── apps/                    # Aplicações
│   ├── api-gateway/        # Gateway API (porta 3001)
│   ├── auth-service/       # Autenticação JWT (porta 3002)
│   ├── tasks-service/      # CRUD Tarefas (porta 3003)
│   ├── notifications-service/  # WebSocket (porta 3004)
│   └── web/                # Frontend React (porta 3000)
├── packages/               # Código compartilhado
│   ├── types/             # TypeScript types
│   ├── ui/                # Componentes reutilizáveis
│   └── typescript-config/ # TS configs base
├── docker-compose.yml     # Orquestração de 7 containers
└── README.md             # Este arquivo
```

---

## 🎯 Instruções Específicas

### 🐳 Primeiro Uso - Passo a Passo

**1. Verificar Pré-requisitos**

```bash
docker --version        # Deve ser 24+
docker-compose --version  # Deve ser 2.20+
```

**2. Clonar e Iniciar**

```bash
git clone <repository-url>
cd project
chmod +x start.sh
./start.sh
```

**3. Aguardar Health Checks (~60 segundos)**

```bash
watch -n 2 docker ps
# Aguardar até todos mostrarem (healthy)
```

**4. Acessar Aplicação**

- Frontend: http://localhost:3000
- Swagger API: http://localhost:3001/docs

### 🗄️ Gerenciar Banco de Dados

**Executar Migrations:**

```bash
docker exec -it tasks-service npm run typeorm:migration:run
```

**Criar Nova Migration:**

```bash
cd apps/tasks-service
npm run typeorm:migration:generate -- src/database/migrations/YourMigrationName
npm run typeorm:migration:run
```

**Acessar PostgreSQL:**

```bash
docker exec -it db psql -U postgres -d challenge-db
# Comandos úteis:
\dt              # Listar tabelas
\d users         # Descrever tabela
SELECT * FROM users;
```

### 🐰 Gerenciar RabbitMQ

**Management UI:**

- URL: http://localhost:15672
- Credenciais: `guest / guest`

**Monitorar Filas:**

```bash
docker exec rabbitmq rabbitmqctl list_queues
docker exec rabbitmq rabbitmqctl list_queues notifications-queue messages_ready
```

### 📊 Monitoramento

**Ver Logs em Tempo Real:**

```bash
docker-compose logs -f                # Todos
docker logs -f tasks-service          # Específico
docker logs --tail 50 auth-service    # Últimas 50 linhas
```

**Monitorar Recursos:**

```bash
docker stats                          # CPU/RAM por container
docker system df                      # Uso de disco
```

### 🧪 Testar API com Swagger

**1. Criar Usuário:**

```bash
# POST http://localhost:3002/api/auth/register
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "123456"
}
```

**2. Fazer Login:**

```bash
# POST http://localhost:3002/api/auth/login
# Response: { "accessToken": "eyJhbGc..." }
```

**3. Autorizar no Swagger:**

- Clicar em "Authorize"
- Inserir: `Bearer eyJhbGc...`

### 🔒 Testar WebSocket

**Via Browser Console:**

```javascript
const token = localStorage.getItem("accessToken");
const socket = io("http://localhost:3004", { auth: { token } });

socket.on("notification", (data) => {
  console.log("📬 Notification:", data);
});
```

### 🐛 Troubleshooting

**Porta ocupada:**

```bash
lsof -i :3000                         # Identificar processo
kill -9 <PID>                         # Matar processo
```

**Container unhealthy:**

```bash
docker logs tasks-service --tail 100  # Ver logs
docker inspect tasks-service          # Ver detalhes
docker exec -it tasks-service sh      # Entrar no container
```

**Não conecta ao banco:**

```bash
docker logs db                        # Logs PostgreSQL
docker exec -it db psql -U postgres   # Testar conexão
```

**Rebuild completo:**

```bash
docker-compose down -v                # Parar e remover volumes
docker rmi $(docker images 'project-*' -q)  # Remover imagens
docker-compose up --build -d          # Rebuild
```

---

## 🛠️ Desenvolvimento

### Instalação de Dependências

```bash
# Instalar todas as dependências do monorepo
npm install
```

### Executar em Modo de Desenvolvimento

```bash
# API Gateway
cd apps/api-gateway && npm run start:dev

# Auth Service
cd apps/auth-service && npm run start:dev

# Tasks Service
cd apps/tasks-service && npm run start:dev

# Notifications Service
cd apps/notifications-service && npm run start:dev

# Frontend
cd apps/web && npm run dev
```

## 🏗️ Arquitetura

O sistema é composto por:

- **Frontend (React)**: Interface web moderna com React 19, TanStack Router e Tailwind CSS
- **API Gateway**: Ponto de entrada único para todas as requisições
- **Auth Service**: Gerenciamento de usuários e autenticação JWT
- **Tasks Service**: CRUD de tarefas e gerenciamento de estado
- **Notifications Service**: Notificações em tempo real via WebSocket
- **PostgreSQL**: Banco de dados relacional
- **RabbitMQ**: Message broker para comunicação entre serviços

### Tecnologias Principais

- **Frontend**: React 19.2, TanStack Router, Tailwind CSS 4, Socket.IO Client
- **Backend**: NestJS 11, TypeScript, TypeORM, Socket.IO
- **Banco de Dados**: PostgreSQL 17
- **Message Broker**: RabbitMQ 3.13
- **Containerização**: Docker, Docker Compose
- **Monorepo**: Turborepo

## 📚 Documentação

- [Guia Docker](docs/DOCKER_GUIDE.md) - Instruções detalhadas sobre Docker
- [Guia de Testes](docs/TESTING_GUIDE_DOCKER.md) - Como testar a aplicação
- [Getting Started](GETTING_STARTED.md) - Guia inicial detalhado

## 🧪 Testes

```bash
# Testar API
./test-api.sh

# Testes unitários
npm test

# Testes e2e
npm run test:e2e
```

## 🐛 Troubleshooting

### Containers não iniciam

```bash
# Limpar containers e volumes
docker-compose down -v

# Reconstruir e iniciar
docker-compose up --build
```

### Portas ocupadas

Verifique se as portas 3000-3004, 5432, 5672 e 15672 estão disponíveis.

### Erros de build

```bash
# Limpar cache do npm
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Docker
docker system prune -a
```

## 📝 Scripts Disponíveis

- `./start.sh` - Inicia todos os serviços com Docker
- `./test-api.sh` - Testa endpoints da API

## 🧹 Manutenção

### Limpar cache do Docker

```bash
# Liberar espaço removendo imagens, containers e volumes não utilizados
docker system prune -a --volumes -f

# Ver uso de espaço atual
docker system df
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [TanStack Router](https://tanstack.com/router)

```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npx turbo link
yarn exec turbo link
pnpm exec turbo link

```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
```
