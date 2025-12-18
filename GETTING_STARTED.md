# 🚀 PRÓXIMOS PASSOS - Como Testar Tudo Agora

## ⏱️ Tempo estimado: 5 minutos

---

## OPÇÃO 1: Docker Compose (Mais Rápido)

### Passo 1: Iniciar a Stack
```bash
cd /home/daniel/Documentos/Projetos\ de\ programação/jungleGamingCrudTarefas/project

# Tornar executável
chmod +x start.sh
chmod +x test-api.sh

# Iniciar
docker-compose up --build
```

**Aguarde ~60 segundos** enquanto:
- PostgreSQL inicializa
- RabbitMQ conecta
- NestJS services compilam
- Frontend transpila com Vite

### Passo 2: Acessar Frontend
```
http://localhost:3000
```

Você verá:
1. ✅ Página de Login
2. Clique em "Registre-se"
3. Preencha: email, username, password
4. Clique em "Registrar"
5. Volte para login
6. Faça login com suas credenciais
7. Você verá a página de tarefas!

### Passo 3: Testar API
Em outro terminal:
```bash
cd project
./test-api.sh
```

Isso vai:
- ✅ Registrar novo usuário
- ✅ Fazer login
- ✅ Criar tarefa
- ✅ Listar tarefas
- ✅ Adicionar comentário
- ✅ Renovar token

---

## OPÇÃO 2: Script Quick Start

```bash
cd project
chmod +x start.sh
./start.sh
```

Este script:
- ✅ Verifica Docker instalado
- ✅ Mostra URLs de acesso
- ✅ Inicia docker-compose up
- ✅ Exibe instruções de teste

---

## OPÇÃO 3: Testes com Curl

```bash
# 1. Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "username": "demouser",
    "password": "demo123456"
  }'

# 2. Login (copie o accessToken)
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123456"
  }' | jq -r '.accessToken')

echo "Token: $TOKEN"

# 3. Criar tarefa
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar autenticação",
    "description": "Criar sistema de login JWT",
    "priority": "HIGH"
  }'

# 4. Listar tarefas
curl http://localhost:3001/api/tasks \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Adicionar comentário
TASK_ID="<your-task-id-here>"
curl -X POST http://localhost:3001/api/tasks/$TASK_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Começando a implementação"
  }'
```

---

## 🌐 URLs DISPONÍVEIS APÓS INICIAR

| URL | Descrição |
|-----|-----------|
| http://localhost:3000 | Frontend React |
| http://localhost:3001 | API Gateway |
| http://localhost:3001/api/docs | Swagger Docs |
| http://localhost:15672 | RabbitMQ Admin (admin:admin) |
| localhost:5432 | PostgreSQL (postgres:password) |

---

## 📊 Fluxo para Testar Completo

### 1️⃣ Registrar Usuário
```
Frontend: http://localhost:3000
→ Clique "Registre-se"
→ Preencha formulário
→ Clique "Registrar"
```

### 2️⃣ Login
```
→ Volte para login
→ Use email e password que registrou
→ Clique "Login"
```

### 3️⃣ Criar Tarefa
```
→ Em "Tarefas", preencha:
  - Título: "Minha primeira tarefa"
  - Descrição: "Uma descrição qualquer"
  - Prioridade: "HIGH"
→ Clique "Criar Tarefa"
```

### 4️⃣ Testar RabbitMQ
```
→ Abra http://localhost:15672
→ Login: admin / admin
→ Vá para "Queues"
→ Você verá: tasks_queue e tasks_events
→ Clique em uma para ver mensagens
```

### 5️⃣ Testar WebSocket (Avançado)
```javascript
// Em Node.js console ou DevTools:
const io = require('socket.io-client');
const socket = io('ws://localhost:3004', {
  query: { userId: 'seu-user-id-aqui' }
});

socket.on('task:created', (data) => {
  console.log('Nova tarefa criada:', data);
});

socket.on('comment:new', (data) => {
  console.log('Novo comentário:', data);
});
```

---

## ✅ O QUE VALIDAR

### Backend (NestJS)
- [ ] Auth Service respondendo em http://localhost:3002/api/auth/login
- [ ] Tasks Service em http://localhost:3003/api/tasks
- [ ] Notifications WebSocket em ws://localhost:3004
- [ ] API Gateway proxy funcionando em http://localhost:3001/api/tasks

### Database
- [ ] PostgreSQL rodando em localhost:5432
- [ ] Tables criadas: users, tasks, comments, task_assignments, notifications
- [ ] Dados sendo inseridos

### RabbitMQ
- [ ] Rodando em localhost:5672
- [ ] Admin UI em http://localhost:15672
- [ ] Filas: tasks_queue, tasks_events

### Frontend
- [ ] React compilando sem erros
- [ ] Login funcionando
- [ ] Tasks carregando
- [ ] Formulários validando

---

## 🐛 Se Algo Não Funcionar

### Erro: "Connection refused"
```bash
# Verifique se todos containers estão rodando
docker-compose ps

# Se algum não estiver, reinicie tudo
docker-compose down
docker-compose up --build
```

### Erro: "Cannot find module"
```bash
# Problema de dependências
rm -rf node_modules apps/*/node_modules
npm install --legacy-peer-deps
docker-compose up --build
```

### Erro: "Port 3000 already in use"
```bash
# Outra aplicação usando a porta
lsof -i :3000
# Ou mude a porta no docker-compose.yml
```

### PostgreSQL não conecta
```bash
# Aguarde mais tempo (até 1 min)
# Ou verifique logs
docker-compose logs db
```

---

## 📝 Documentação Adicional

| Documento | Propósito |
|-----------|-----------|
| [README_IMPLEMENTATION.md](README_IMPLEMENTATION.md) | Setup + instruções detalhadas |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Detalhe técnico de cada parte |
| [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) | Resumo para stakeholders |
| [CHECKLIST.md](CHECKLIST.md) | Checklist de todos requisitos |

---

## 🎯 Fluxo Recomendado

1. **Iniciar:** `docker-compose up --build`
2. **Aguardar:** ~60 segundos
3. **Frontend:** Abrir http://localhost:3000
4. **Registrar:** Criar novo usuário
5. **Login:** Fazer login
6. **Criar tarefa:** Adicionar primeira tarefa
7. **Comentar:** Adicionar comentário
8. **Testar API:** `./test-api.sh`
9. **Verificar Swagger:** http://localhost:3001/api/docs
10. **RabbitMQ:** http://localhost:15672 (admin:admin)

---

## ⚡ Quick Commands

```bash
# Iniciar tudo
docker-compose up --build

# Logs em tempo real
docker-compose logs -f

# Logs de serviço específico
docker-compose logs -f auth-service

# Parar tudo
docker-compose down

# Limpar volumes
docker-compose down -v

# Reiniciar um serviço
docker-compose restart tasks-service

# Build apenas
docker-compose build --no-cache

# Ver containers rodando
docker-compose ps
```

---

## 🎊 Parabéns!

Você tem um sistema full-stack funcional com:
- ✅ Autenticação JWT
- ✅ CRUD de tarefas
- ✅ Comentários
- ✅ Notificações real-time
- ✅ Microserviços
- ✅ Tudo containerizado

**Aproveite! 🚀**

