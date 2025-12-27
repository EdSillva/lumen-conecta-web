# Lumen Conecta - web

Monorepo com frontend (Vue 3 + Vite + Tailwind + Pinia + Firebase Auth)

## Estrutura
- apps/web: SPA com Vue Router, Pinia e Tailwind.

## Requisitos
- Node.js 18+
- npm (workspaces) ou pnpm/yarn conforme preferência

## Setup rápido
```sh
pnpm install
pnpm dev   # frontend em http://localhost:5173
```

Configure `.env` em `apps/web` e `apps/api` a partir dos arquivos `.env.example` para Firebase e Supabase.

## Scripts principais
- pnpm dev — inicia o Vite.
- pnpm build — executa build.
- pnpm lint — lint em todos os arquivos.
- pnpm format — formata código (Prettier) em todos os arquivos.

## Próximos passos
- Conectar Supabase (persistência real de eventos/galerias).
- Propagar roles via claims do Firebase e consultar tabela `user_roles`.
- Substituir mocks por consultas reais.
- Adicionar testes automatizados.
