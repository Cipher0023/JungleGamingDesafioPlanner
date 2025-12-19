# 🚀 Guia Rápido - Frontend

## Instalação

```bash
# Na raiz do monorepo
npm install

# Ou apenas no frontend
cd apps/web
npm install
```

## Desenvolvimento

```bash
# Rodar o frontend em modo desenvolvimento
cd apps/web
npm run dev

# Ou da raiz com turbo
npm run dev --filter=web
```

O app estará disponível em: http://localhost:3000

## Build

```bash
# Build de produção
npm run build

# Preview da build
npm run preview
```

## Testes

```bash
# Rodar testes
npm test

# Testes em watch mode
npm test -- --watch
```

## Lint & Format

```bash
# Rodar eslint
npm run lint

# Fix problemas automaticamente
npm run lint -- --fix

# Formatar código
npm run format
```

## Estrutura de Pastas

```
apps/web/
├── src/
│   ├── components/      # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── context/        # React Context
│   ├── routes/         # Páginas/rotas
│   ├── lib/            # Utilitários
│   └── styles.css      # Estilos globais
├── public/             # Assets estáticos
└── package.json
```

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `apps/web/`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_NOTIFICATIONS_URL=http://localhost:3003
```

## Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Erro de TypeScript
```bash
# Limpar cache do TypeScript
rm -rf node_modules/.cache
```

### Hot reload não funciona
```bash
# Restartar o servidor dev
# Ctrl+C e rodar novamente
npm run dev
```

## Recursos Úteis

- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Sonner](https://sonner.emilkowal.ski)

## Dicas de Desenvolvimento

1. Use o React DevTools para debug
2. Instale a extensão Tailwind CSS IntelliSense no VSCode
3. Configure o ESLint no seu editor
4. Use o TypeScript Language Server para autocompletar

## Comandos Docker

Se estiver usando Docker:

```bash
# Build da imagem
docker build -t jungle-gaming-web .

# Rodar container
docker run -p 3000:80 jungle-gaming-web
```
