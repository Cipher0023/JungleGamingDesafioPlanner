#!/bin/bash
# 🧪 Test Suite - Jungle Gaming API

set -e

BASE_URL="http://localhost:3001/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   🧪 Test Suite - Jungle Gaming${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Register User
echo -e "${YELLOW}[1/6] Testing Register...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "password123"
  }')

echo -e "${GREEN}✓ Register Response:${NC}"
echo "$REGISTER_RESPONSE" | jq .
echo ""

# Test 2: Login
echo -e "${YELLOW}[2/6] Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

echo -e "${GREEN}✓ Login Response:${NC}"
echo "$LOGIN_RESPONSE" | jq .

# Extract tokens
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken')
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')

echo -e "${GREEN}✓ Tokens extracted:${NC}"
echo "  Access Token: ${ACCESS_TOKEN:0:20}..."
echo "  Refresh Token: ${REFRESH_TOKEN:0:20}..."
echo "  User ID: $USER_ID"
echo ""

# Test 3: Create Task
echo -e "${YELLOW}[3/6] Testing Create Task...${NC}"
TASK_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar login",
    "description": "Criar tela de login com autenticação JWT",
    "priority": "HIGH",
    "dueDate": "2025-12-31T23:59:59Z"
  }')

echo -e "${GREEN}✓ Create Task Response:${NC}"
echo "$TASK_RESPONSE" | jq .

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Task ID: $TASK_ID${NC}"
echo ""

# Test 4: List Tasks
echo -e "${YELLOW}[4/6] Testing List Tasks...${NC}"
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/tasks?page=1&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${GREEN}✓ List Tasks Response:${NC}"
echo "$LIST_RESPONSE" | jq .
echo ""

# Test 5: Add Comment
echo -e "${YELLOW}[5/6] Testing Add Comment...${NC}"
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks/$TASK_ID/comments" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Tarefa em progresso, já começou a implementação"
  }')

echo -e "${GREEN}✓ Add Comment Response:${NC}"
echo "$COMMENT_RESPONSE" | jq .
echo ""

# Test 6: Refresh Token
echo -e "${YELLOW}[6/6] Testing Refresh Token...${NC}"
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

echo -e "${GREEN}✓ Refresh Token Response:${NC}"
echo "$REFRESH_RESPONSE" | jq .
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# WebSocket Test Info
echo -e "${YELLOW}📡 WebSocket Connection Test:${NC}"
echo ""
echo "Use em Node.js ou Postman:"
echo ""
echo "const io = require('socket.io-client');"
echo "const socket = io('ws://localhost:3004', {"
echo "  query: { userId: '$USER_ID' }"
echo "});"
echo ""
echo "socket.on('task:created', (data) => console.log('Nova tarefa:', data));"
echo "socket.on('comment:new', (data) => console.log('Novo comentário:', data));"
echo ""

# Advanced Tests
echo -e "${YELLOW}🔧 Advanced Test Commands:${NC}"
echo ""
echo "# Get specific task:"
echo "curl $BASE_URL/tasks/$TASK_ID \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\" | jq"
echo ""
echo "# Update task status:"
echo "curl -X PUT $BASE_URL/tasks/$TASK_ID \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"status\": \"IN_PROGRESS\"}' | jq"
echo ""
echo "# Assign task to user:"
echo "curl -X POST $BASE_URL/tasks/$TASK_ID/assign \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d \"{\\\"userId\\\": \\\"$USER_ID\\\"}\" | jq"
echo ""
echo "# Get task comments:"
echo "curl $BASE_URL/tasks/$TASK_ID/comments \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\" | jq"
echo ""
echo "# View Swagger docs:"
echo "open http://localhost:3001/api/docs"
echo ""
echo "# RabbitMQ Management:"
echo "open http://localhost:15672 (admin:admin)"
echo ""
