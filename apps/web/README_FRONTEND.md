# Frontend - Jungle Gaming Task Manager

## 🎨 Visão Geral

Interface moderna e responsiva para gerenciamento de tarefas construída com React, TypeScript, TanStack Router e Tailwind CSS.

## ✨ Funcionalidades Implementadas

### 1. 📋 Gerenciamento de Tarefas

#### Visualização de Tarefas
- **Grade**: Visualização em cards organizada em grid responsivo (1-3 colunas)
- **Kanban**: Visualização em colunas por status (A Fazer, Em Andamento, Em Revisão, Concluído)
- Toggle intuitivo entre modos de visualização

#### TaskCard Component
- Design limpo e moderno
- Indicadores visuais de status e prioridade
- Informações de criador e executor
- Destaque visual para tarefas atrasadas
- Efeito hover para melhor UX
- Click para abrir detalhes

### 2. 🔍 Filtros e Busca

Sistema completo de filtros incluindo:
- **Busca por texto**: Busca em título e descrição
- **Filtro por status**: Todos, A Fazer, Em Andamento, Em Revisão, Concluído
- **Filtro por prioridade**: Todas, Baixa, Média, Alta, Urgente
- **Filtro de tarefas atrasadas**: Checkbox para mostrar apenas tarefas vencidas
- **Limpar filtros**: Botão para resetar todos os filtros de uma vez

### 3. 📝 Modal de Detalhes

TaskDetailsModal com funcionalidades completas:
- **Visualização detalhada**: Todas as informações da tarefa
- **Modo de edição**: Toggle entre visualização e edição
- **Edição inline**: Todos os campos editáveis
- **Atribuição de executor**: Select com lista de usuários
- **Definição de prazo**: Date picker integrado
- **Exclusão de tarefa**: Com confirmação de segurança
- **Timestamps**: Exibição de datas de criação e atualização
- **Validação**: Feedback visual de sucesso/erro

### 4. ➕ Criação de Tarefas

CreateTaskModal com:
- Formulário completo de criação
- Seleção de prioridade e status
- Atribuição de executor
- Definição de prazo
- Validação de campos obrigatórios
- Feedback visual de criação

### 5. 🔔 Notificações em Tempo Real

Sistema de notificações via WebSocket:
- **Conexão automática**: Conecta ao notifications-service ao fazer login
- **Indicador de status**: Badge visual mostrando Online/Offline
- **Eventos suportados**:
  - `taskCreated`: Nova tarefa criada
  - `taskUpdated`: Tarefa atualizada
  - `taskDeleted`: Tarefa excluída
  - `taskAssigned`: Tarefa atribuída ao usuário
- **Atualização automática**: Lista de tarefas atualiza ao receber notificações
- **Toast notifications**: Feedback visual para cada evento
- **Reconexão automática**: Tenta reconectar em caso de falha

### 6. 👥 Gerenciamento de Usuários

Hook useUsers para:
- Cache de informações de usuários
- Mapeamento rápido de IDs para nomes
- Listagem de usuários para seleção
- Atualização automática

## 🏗️ Estrutura de Componentes

```
src/
├── components/
│   ├── TaskCard.tsx              # Card individual de tarefa
│   ├── TaskDetailsModal.tsx      # Modal de detalhes/edição
│   ├── TaskFilters.tsx           # Componente de filtros
│   ├── CreateTaskModal.tsx       # Modal de criação
│   ├── KanbanBoard.tsx          # Visualização Kanban
│   ├── Header.tsx               # Cabeçalho da aplicação
│   └── ui/                      # Componentes de UI reutilizáveis
│       ├── card.tsx
│       ├── badge.tsx
│       └── ...
├── hooks/
│   ├── useNotifications.ts      # Hook para WebSocket
│   └── useUsers.ts              # Hook para gerenciar usuários
├── context/
│   └── AuthContext.tsx          # Context de autenticação
├── routes/
│   ├── login.tsx                # Página de login
│   ├── register.tsx             # Página de registro
│   └── tasks.tsx                # Página principal de tarefas
└── styles.css                   # Estilos globais
```

## 🎯 Estados e Filtros

### Estados de Tarefa
- `TODO` - A Fazer (Cinza)
- `IN_PROGRESS` - Em Andamento (Azul)
- `REVIEW` - Em Revisão (Amarelo)
- `DONE` - Concluído (Verde)

### Prioridades
- `LOW` - Baixa (Cinza)
- `MEDIUM` - Média (Azul)
- `HIGH` - Alta (Laranja)
- `URGENT` - Urgente (Vermelho)

## 🔐 Autenticação

- Login com email e senha
- Registro de novos usuários
- Tokens JWT (access + refresh)
- Persistência em localStorage
- Redirecionamento automático
- Logout seguro

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**:
  - `sm`: 640px (1 coluna)
  - `md`: 768px (2 colunas)
  - `lg`: 1024px (3 colunas no grid, 4 no Kanban)
- **Touch-friendly**: Botões e áreas clicáveis otimizadas

## 🎨 Design System

### Cores
- **Primary**: Blue-600 (Ações principais)
- **Success**: Green (Conclusões e confirmações)
- **Warning**: Yellow (Revisões e alertas)
- **Danger**: Red (Exclusões e erros)
- **Gray Scale**: Para textos e backgrounds

### Ícones
- Lucide React: Biblioteca de ícones moderna e consistente
- Ícones semânticos para cada ação
- Tamanhos padronizados (w-4 h-4, w-5 h-5)

### Animações
- Transições suaves em hover
- Feedback visual de clique
- Skeleton loading states
- Toast notifications animadas

## 🚀 Performance

### Otimizações Implementadas
- `useMemo` para filtros de tarefas
- Lazy loading de modais
- Debounce em campos de busca (via controlled inputs)
- Cache de usuários
- Reconexão inteligente do WebSocket

### Boas Práticas
- TypeScript para type safety
- Component composition
- Custom hooks para lógica reutilizável
- Separation of concerns
- Error boundaries

## 🔧 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3001/api
VITE_NOTIFICATIONS_URL=http://localhost:3003
```

## 📦 Dependências Principais

```json
{
  "react": "^19.2.0",
  "@tanstack/react-router": "^1.132.0",
  "@tanstack/react-query": "^5.90.12",
  "axios": "^1.13.2",
  "socket.io-client": "^4.8.1",
  "sonner": "^2.0.7",
  "lucide-react": "^0.545.0",
  "tailwindcss": "^4.0.6",
  "framer-motion": "^12.23.26",
  "react-hook-form": "^7.68.0",
  "zod": "^3.25.76"
}
```

## 🎯 Próximas Melhorias Sugeridas

- [ ] Drag & drop entre colunas Kanban
- [ ] Filtros avançados (múltiplos executores, range de datas)
- [ ] Paginação infinita / virtual scrolling
- [ ] Modo escuro
- [ ] PWA para uso offline
- [ ] Anexos em tarefas
- [ ] Comentários e histórico de atividades
- [ ] Etiquetas/tags customizadas
- [ ] Dashboard com métricas
- [ ] Export de tarefas (PDF, CSV)

## 🐛 Debug

### WebSocket não conecta
1. Verificar se o notifications-service está rodando
2. Confirmar URL correta no `.env`
3. Verificar console do navegador para erros
4. Checar se o token está válido

### Filtros não funcionam
1. Verificar se há tarefas carregadas
2. Confirmar que os filtros estão sendo aplicados
3. Checar o useMemo dependencies array

### Performance lenta
1. Verificar número de tarefas (considerar paginação)
2. Profiler do React DevTools
3. Network tab para requisições lentas

## 📝 Notas de Desenvolvimento

- Todos os componentes são funcionais com hooks
- TypeScript strict mode habilitado
- ESLint e Prettier configurados
- Código segue padrões do Airbnb Style Guide
- Commits seguem Conventional Commits

---

**Desenvolvido com ❤️ para Jungle Gaming**
