# site-demo

Site de validación del sistema HWE. Vive dentro del monorepo `hwe-core`, en el
mismo Turborepo que `packages/core-ui/` — los cambios en bloques se ven sin
publicar a npm (`workspace:*`, ver `docs/decisiones/DEC-007-repos.md`).

Cuando el Hito 1 esté completo, este código se extrae como el repo `hwe-template`
(HU-012).

## Requisitos

- Node.js >= 20, pnpm 9 (ver README de la raíz del monorepo)
- Postgres 15+, local o en Docker

## Setup local

1. Copia `.env.example` a `.env` y rellena las variables:

   ```bash
   cp .env.example .env
   ```

   - `POSTGRES_URL` — cadena de conexión a tu Postgres local. Una base de datos
     propia para site-demo (no la compartas con otro proyecto — DEC-003). El
     nombre lo exige `@payloadcms/db-vercel-postgres` (su CLI de introspección
     de esquema usa el SDK de `@vercel/postgres`, que lee esta variable
     directamente) — no vale renombrarla a `DATABASE_URI` u otra.
   - `PAYLOAD_SECRET` — genera una cadena aleatoria propia, por ejemplo:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXT_PUBLIC_SERVER_URL` — `http://localhost:3000` en local.

2. Crea la base de datos si no existe:

   **Postgres local:**

   ```bash
   createdb site-demo
   ```

   **Docker:**

   ```bash
   docker run --name site-demo-postgres -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=site-demo -p 5432:5432 -d postgres:16
   ```

3. Desde la raíz del monorepo:

   ```bash
   pnpm install
   pnpm dev --filter site-demo
   ```

4. Abre `http://localhost:3000/admin` y crea el primer usuario (Payload lo pide
   la primera vez que no hay ningún `users` en la base de datos).

## Comandos

| Comando                                      | Qué hace                                                      |
| -------------------------------------------- | ------------------------------------------------------------- |
| `pnpm dev --filter site-demo`                | Next.js en modo desarrollo                                    |
| `pnpm build --filter site-demo`              | Build de producción                                           |
| `pnpm lint --filter site-demo`               | ESLint (variante repos-app)                                   |
| `pnpm --filter site-demo generate:types`     | Regenera `src/payload-types.ts` desde las colecciones/globals |
| `pnpm --filter site-demo generate:importmap` | Regenera `src/app/(payload)/admin/importMap.js`               |

## Desarrollo contra `@hwe-platform/core-ui` local

`@hwe-platform/core-ui` se consume via `workspace:*` — Turborepo lo resuelve
directamente desde `packages/core-ui/`. Para ver cambios de un bloque reflejados
aquí:

```bash
# desde la raíz del monorepo, en otra terminal
pnpm --filter @hwe-platform/core-ui dev   # tsc --watch, recompila dist/ al guardar
```

No hace falta publicar a npm ni usar `pnpm link` mientras ambos vivan en este
monorepo (eso solo aplica tras la extracción a `hwe-template` — ver DEC-007).

## Estructura

```
src/
  payload.config.ts        # config base de Payload (sin colecciones de contenido — vienen en HU-005)
  collections/
    Users.ts                # colección de auth del admin, infraestructura de Payload
  styles/
    theme.css                # tokens de marca (Capa 1 — docs/arquitectura/tokens.md)
    globals.css               # Tailwind v4 + @theme inline + tipografía base
  blocks/                    # bloques custom del site-demo (overrides, vacío por ahora)
  services/                  # capa de consultas a Payload (vacía, preparada)
  block-registry.ts          # registry que extenderá el de @hwe-platform/core-ui (HU-008)
  app/
    (frontend)/               # rutas del sitio público
      [...slug]/page.tsx       # catch-all — placeholder hasta HU-008
    (payload)/                # admin y API de Payload
      admin/[[...segments]]/
      api/
```
