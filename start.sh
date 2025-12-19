#!/bin/bash

# ===========================================
# 🚀 Jungle Gaming - Docker Start Script
# ===========================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções utilitárias
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}   $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC}  $1"
}

# Verificar Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não encontrado. Instale: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon não está rodando. Inicie o Docker Desktop."
        exit 1
    fi
    
    print_success "Docker está pronto"
}

# Limpar containers antigos
cleanup_old_containers() {
    print_info "Limpando containers antigos..."
    docker-compose down -v 2>/dev/null || true
    print_success "Containers antigos removidos"
}

# Construir imagens
build_images() {
    print_info "Construindo imagens Docker..."
    print_warning "Isso pode levar alguns minutos na primeira vez..."
    
    if docker-compose build --parallel; then
        print_success "Imagens construídas com sucesso"
    else
        print_error "Falha ao construir imagens"
        exit 1
    fi
}

# Iniciar serviços
start_services() {
    print_info "Iniciando serviços..."
    
    docker-compose up -d
    
    print_success "Containers iniciados"
}

# Aguardar serviços ficarem saudáveis
wait_for_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    print_info "Aguardando $service ficar saudável..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker inspect --format='{{.State.Health.Status}}' $service 2>/dev/null | grep -q "healthy"; then
            print_success "$service está saudável"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo ""
    print_error "$service não ficou saudável após ${max_attempts} tentativas"
    return 1
}

# Verificar saúde de todos os serviços
check_all_health() {
    print_header "Verificando Saúde dos Serviços"
    
    local services=(
        "db:PostgreSQL"
        "rabbitmq:RabbitMQ"
        "auth-service:Auth Service"
        "tasks-service:Tasks Service"
        "notifications-service:Notifications Service"
        "api-gateway:API Gateway"
        "web:Frontend"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r container name <<< "$service_info"
        if wait_for_health "$container"; then
            echo ""
        else
            print_error "Falha na inicialização de $name"
            show_logs "$container"
            return 1
        fi
    done
}

# Mostrar logs de um serviço
show_logs() {
    local service=$1
    print_warning "Últimas 20 linhas de log de $service:"
    docker logs --tail 20 "$service" 2>&1 || true
}

# Mostrar URLs
show_urls() {
    print_header "URLs Disponíveis"
    echo ""
    echo -e "  ${GREEN}🌐 Frontend:${NC}          http://localhost:3000"
    echo -e "  ${GREEN}📡 API Gateway:${NC}       http://localhost:3001"
    echo -e "  ${GREEN}📚 API Docs (Swagger):${NC} http://localhost:3001/api/docs"
    echo -e "  ${GREEN}🔐 Auth Service:${NC}      http://localhost:3002"
    echo -e "  ${GREEN}📋 Tasks Service:${NC}     http://localhost:3003"
    echo -e "  ${GREEN}🔔 Notifications:${NC}     http://localhost:3004"
    echo -e "  ${GREEN}🐰 RabbitMQ Admin:${NC}    http://localhost:15672 (admin/admin)"
    echo -e "  ${GREEN}🗄️  PostgreSQL:${NC}       localhost:5432 (postgres/password)"
    echo ""
}

# Mostrar próximos passos
show_next_steps() {
    print_header "Próximos Passos"
    echo ""
    echo "  1. Abra http://localhost:3000 no navegador"
    echo "  2. Clique em 'Registre-se' para criar uma conta"
    echo "  3. Faça login com suas credenciais"
    echo "  4. Comece a criar e gerenciar tarefas!"
    echo ""
    print_info "Para ver logs em tempo real:"
    echo "    docker-compose logs -f"
    echo ""
    print_info "Para parar os serviços:"
    echo "    docker-compose down"
    echo ""
}

# Função principal
main() {
    clear
    print_header "Jungle Gaming - Inicialização Docker"
    echo ""
    
    # Verificações
    check_docker
    
    # Perguntar se quer limpar
    read -p "$(echo -e ${YELLOW}Limpar containers e volumes antigos? [y/N]:${NC} )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup_old_containers
    fi
    
    # Build e start
    build_images
    echo ""
    start_services
    echo ""
    
    # Aguardar saúde
    if check_all_health; then
        echo ""
        print_success "Todos os serviços estão saudáveis!"
        echo ""
        show_urls
        show_next_steps
        
        print_header "Sistema Pronto! 🎉"
    else
        print_error "Alguns serviços falharam ao iniciar"
        print_info "Execute para ver todos os logs:"
        echo "    docker-compose logs"
        exit 1
    fi
}

# Executar
main
