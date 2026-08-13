# AGENTS.md — Razcon Soluções Contábeis

Contexto para agentes de IA (Cursor, Claude Code, etc.) trabalhando neste repositório.

## Visão geral do projeto

Sistema web para a **Razcon Soluções Contábeis**, escritório de contabilidade. Domínio: lançamentos contábeis, notas fiscais, obrigações fiscais, folha de pagamento, relatórios/DRE, portal do cliente.

## Stack

- **Monorepo**: Yarn workspaces (`apps/*`, `packages/*`)
- **Web**: Nuxt 4 (`apps/web`, `srcDir: app/`) + Tailwind CSS v4 (tokens via `@theme` em `theme.css`)
- **API**: Express + Effect + Prisma (`apps/backend`) — clean architecture
- **Shared**: schemas Zod em `@razconms/shared`
- **Linguagem**: TypeScript

### Effect (backend)

- Ports tipados em `application/ports/`
- `Context.Tag` em `*.context.ts`
- Adapters e `Layer` em `infrastructure/`
- Use cases retornam `Effect`; HTTP resolve via `ManagedRuntime` + `Exit`

### Tooling (Prettier + ESLint + Vitest)

Usar como template em projetos futuros Up2tech semelhantes:

| Ferramenta         | Onde                                                 | Comandos                            |
| ------------------ | ---------------------------------------------------- | ----------------------------------- |
| **Prettier**       | `.prettierrc` na raiz                                | `yarn format` / `yarn format:write` |
| **ESLint**         | flat config por workspace + `eslint-config-prettier` | `yarn lint` / `yarn lint:fix`       |
| **Vitest**         | `packages/shared`, `apps/backend`                    | `yarn test` / `yarn test:watch`     |
| **@effect/vitest** | use cases Effect no backend                          | `it.effect` / `it.scoped`           |

- Não introduzir Jest, Mocha, Biome ou segundo formatador sem decisão do time.
- Testes: `*.test.ts` / `*.spec.ts`; excluir do emit via `tsconfig.build.json`.
- Ver também `.cursor/rules/tooling-monorepo.mdc` e agentes em `.cursor/agents/`.

## Design system

Os tokens de cor vêm de `apps/web/app/assets/css/theme.css` (importado após `@import "tailwindcss"`). **Nunca hardcode hex nos componentes** — sempre usar as classes utilitárias geradas pelos tokens.

- `brand-navy-{50..950}` — primária. Tom da logo: `900` (`#18203a`).
- `brand-gold-{50..950}` — acento, usar com moderação. Tom da logo: `500` (`#ab9754`).
- `neutral-{50..950}` — texto secundário, bordas, backgrounds.
- Aliases semânticos: `bg-primary`, `bg-accent`, `bg-surface`, `bg-surface-muted`, `border-border`, `text-text`, `text-text-muted`.
- Feedback: `success` (verde), `warning` (âmbar), `danger` (vermelho) — usar **apenas** para status (pago/pendente/vencido), nunca decorativo.
- Evitar dourado em grandes áreas de fundo — cansa a leitura em telas longas de extrato/relatório.
- Raios: `--radius-sm/md/lg/xl`, perfil sóbrio e corporativo (contabilidade = confiança).
- Fonte: Inter. Valores monetários sempre com `tabular-nums`.

Ver `STYLE_GUIDE.md` na raiz para exemplos de uso por contexto (dashboard, tabelas de lançamento, status fiscal).

## Identidade visual / assets

Ícones e favicons ficam em `apps/web/public/`. Usar a versão **navy-bg** como ícone padrão da aplicação (PWA, apple-touch-icon); versão **transparente** para uso sobre header colorido.

## Convenções de código

- Componentes em `PascalCase.vue`, composables em `useX.ts`.
- Preferir Composition API com `<script setup lang="ts">`.
- Tipar dados vindos da API/banco explicitamente (evitar `any`); domínio contábil é sensível a erros de tipo em valores monetários — usar tipo dedicado ou `number` em centavos, nunca float direto para dinheiro.
- Nomes de variáveis/domínio em português quando refletem termos contábeis específicos (ex: `lancamento`, `notaFiscal`, `dre`), em inglês para termos técnicos genéricos (ex: `fetchData`, `isLoading`).
- Datas em formato `pt-BR` (dd/mm/aaaa) na UI; ISO 8601 internamente.
- SEO e `<head>`: alterações em `composables/useSiteSeoHead.ts`, sem duplicar meta em vários lugares.
- Respeitar `nuxt-security` (CSP, headers): não relaxar `script-src` / `style-src` sem motivo documentado.

## O que evitar

- Não introduzir novas cores fora da paleta de `theme.css` sem atualizar o style guide.
- Não usar `localStorage`/`sessionStorage` em componentes que rodem como Artifacts/preview.
- Não expor dados fiscais/pessoais de clientes em logs ou mensagens de erro no client-side.

## Deploy (Docker + Traefik + Supabase)

Produção na OS: `docker-compose.yml` + Traefik (rede `web`, nunca `host`) + Postgres do Supabase. Sem serviço `db` e sem `ports:` no host. Ver README seção **Docker + Traefik**.

- SSR: `NUXT_API_BASE=http://razconms-backend:3001`
- Browser/CSP: `NUXT_PUBLIC_API_BASE=https://api.…` (build args no Dockerfile da web)
- Prisma: gerar client e copiar `output` para `dist` (wasm/runtime)
- Vue: pin único via `resolutions` (Yarn 1)
- Web Docker (padrão Gutierres): runtime com `node_modules` da raiz; só substituir `vue`/`@vue` incompletos no `.output`. Não copiar deps uma a uma.

## Entrega

- Manter mobile-first, acessibilidade básica (labels, foco, contraste) e alinhamento com tokens Tailwind do projeto.
- Após mudanças relevantes: `yarn lint` e `yarn test`; `yarn format` se houver muita formatação; builds só com acordo do time.
