#!/bin/bash

# Script para verificar health de todos os serviços
# Uso: ./health-check.sh

echo "🏥 Verificando Health de Todos os Serviços..."
echo "=============================================="
echo ""

services=(
  "db:5432:PostgreSQL"
  "rabbitmq:15672:RabbitMQ Management"
  "auth-service:3002/api/health:Auth Service"
  "tasks-service:3003/api/health:Tasks Service"
  "notifications-service:3004/api/health:Notifications Service"
  "api-gateway:3001/api/health:API Gateway"
  "web:3000:Frontend Web"
)

for service in "${services[@]}"; do
  IFS=':' read -r container endpoint name <<< "$service"
  
  echo -n "Checking $name... "
  
  # Verifica se container está rodando
  if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
    echo "❌ Container não está rodando"
    continue
  fi
  
  # Testa o endpoint
  if [[ "$endpoint" == *"/"* ]]; then
    # É uma URL HTTP
    if curl -sf "http://localhost:${endpoint}" > /dev/null 2>&1; then
      echo "✅ Healthy"
    else
      echo "❌ Não responde"
      # Mostra últimas 5 linhas de log
      echo "   Últimos logs:"
      docker logs "$container" 2>&1 | tail -5 | sed 's/^/   /'
    fi
  else
    # É apenas uma porta (verificar se está aberta)
    if nc -z localhost "${endpoint}" 2>/dev/null; then
      echo "✅ Porta aberta"
    else
      echo "❌ Porta fechada"
    fi
  fi
done

echo ""
echo "=============================================="
echo "Status dos containers:"
docker-compose ps
