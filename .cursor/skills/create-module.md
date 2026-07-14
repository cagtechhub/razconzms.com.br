# Create Module

Input:

- module.yaml (ou descrição equivalente)

Steps:

1. Read specification
2. Generate architecture artifacts
3. Generate entities / domain errors
4. Generate ports, Context.Tag, use cases
5. Generate Prisma schema + migration (cuid / uuid conforme padrão do repo)
6. Generate HTTP endpoints (Effect + Express) com validação Zod
7. Generate schemas em `@razconms/shared` se o contrato for compartilhado
8. Generate tests with **Vitest** + **`@effect/vitest`** (`it.effect` / `it.scoped`)
9. Run `yarn lint` and `yarn test` for the touched workspaces
10. Ensure Prettier (root `.prettierrc`) — use `yarn format:write` if needed

Outputs:

- domain
- application
- infrastructure
- tests (`*.test.ts`)
- documentation (quando pedido)
