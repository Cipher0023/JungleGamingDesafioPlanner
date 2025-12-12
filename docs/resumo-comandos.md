# 🎯 **RESUMO - COMANDOS PARA RODAR O PROJETO**

## 🚀 **COMANDOS PRINCIPAIS**

### 1. **Iniciar Infraestrutura (Docker):**

```bash
docker-compose up -d
```

### 2. **Verificar Status de Todos os Serviços:**

```bash
./check-services.sh
```

### 3. **Rodar Auth Service (para testar primeiro):**

```bash
cd apps/auth-service
npm run start:dev
```

### 4. **Testar se Auth Service Está Funcionando:**

```bash
curl http://localhost:3002/health
curl http://localhost:3002/users
```

---

## 📁 **ARQUIVOS CRIADOS**

### 📖 **Guias:**

- `docs/como-rodar-projeto.md` - Guia completo de execução
- `docs/reset-banco-dados.md` - Como resetar banco se necessário
- `docs/progresso-completo.md` - Resumo de tudo que foi feito

### 🛠️ **Scripts:**

- `check-services.sh` - Script para verificar status de todos os serviços

---

## 🎯 **WORKFLOW RECOMENDADO**

### **1. Iniciar Infraestrutura:**

```bash
docker-compose up -d
```

### **2. Verificar se tudo OK:**

```bash
./check-services.sh
```

### **3. Iniciar Auth Service:**

```bash
cd apps/auth-service
npm run start:dev
```

### **4. Monitorar no Terminal:**

- Você verá logs em tempo real
- Se houver erro, aparecerá no terminal
- Ctrl+C para parar o serviço

### **5. Testar API:**

```bash
curl http://localhost:3002/users
```

---

## 🔍 **COMANDOS ÚTEIS DE MONITORAMENTO**

### **Verificar se Docker está funcionando:**

```bash
docker-compose ps
```

### **Ver logs do banco:**

```bash
docker-compose logs db
```

### **Verificar se PostgreSQL responde:**

```bash
docker-compose exec db pg_isready -U postgres
```

### **Conectar ao banco:**

```bash
docker-compose exec db psql -U postgres -d jungle_db
```

---

## 🚨 **SE ALGO DER ERRADO**

### **Parar todos os serviços:**

```bash
pkill -f "npm run start:dev"
```

### **Reiniciar infraestrutura:**

```bash
docker-compose restart
```

### **Ver processos rodando:**

```bash
ps aux | grep node
```

---

## ✅ **RESULTADO ESPERADO**

Quando tudo estiver funcionando:

- ✅ `./check-services.sh` mostra "OK" para todos os serviços
- ✅ `curl http://localhost:3002/users` retorna dados ou array vazio
- ✅ Logs no terminal mostram "Nest application successfully started"

**Pronto para desenvolver!** 🎉
