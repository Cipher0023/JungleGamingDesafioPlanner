#!/bin/bash

# 🚀 Jungle Gaming - Quick Start Script

echo "🚀 Iniciando Jungle Gaming Stack..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Jungle Gaming - Gestão de Tarefas${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar Docker
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose não encontrado. Instale: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker Compose encontrado"
echo ""

# Iniciar Docker Compose
echo -e "${BLUE}📦 Iniciando containers...${NC}"
docker-compose up --build

echo ""
echo -e "${GREEN}✓ Stack iniciada!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}URLs Disponíveis:${NC}"
echo -e "  🌐 Frontend:      ${GREEN}http://localhost:3000${NC}"
echo -e "  📡 API Gateway:   ${GREEN}http://localhost:3001${NC}"
echo -e "  📚 Swagger Docs:  ${GREEN}http://localhost:3001/api/docs${NC}"
echo -e "  🐰 RabbitMQ:      ${GREEN}http://localhost:15672${NC} (admin:admin)"
echo -e "  🗄️  PostgreSQL:   ${GREEN}localhost:5432${NC} (postgres:password)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 Próximos passos:${NC}"
echo "  1. Abra http://localhost:3000"
echo "  2. Clique em 'Registre-se' para criar uma conta"
echo "  3. Faça login com suas credenciais"
echo "  4. Comece a criar tarefas!"
echo ""
echo -e "${YELLOW}📝 Teste com curl:${NC}"
echo ""
echo "  # Registrar"
echo "  curl -X POST http://localhost:3001/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"test@test.com\",\"username\":\"testuser\",\"password\":\"123456\"}'"
echo ""
echo "  # Login"
echo "  curl -X POST http://localhost:3001/api/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"test@test.com\",\"password\":\"123456\"}'"
echo ""
echo -e "${YELLOW}🛑 Para parar: Pressione Ctrl+C${NC}"
echo ""
