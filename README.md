# hwe-core

Monorepo de paquetes npm compartidos del proyecto HWE. Contiene `@hwe-platform/core-ui`,
consumido por `hwe-template` y por los sites de cliente vía GitHub Packages.

## Estructura

```
hwe-core/
  packages/
    core-ui/        # @hwe-platform/core-ui — bloques, primitivas, renderer, layout, adapters, theme
```

## Requisitos

- Node.js >= 20
- pnpm 9 (`corepack enable` lo instala automáticamente según `packageManager` en `package.json`)

## Setup local

```bash
git clone https://github.com/AD-Web-Headless-IA-V2/hwe-core.git
cd hwe-core
pnpm install
```

No hace falta un token de GitHub para instalar o desarrollar en este repo:
ninguna dependencia propia vive todavía en GitHub Packages. Un token solo
es necesario para **publicar** `@hwe-platform/core-ui` (lo hace CI automáticamente)
o para **consumirlo** desde otro repo (ver `.npmrc` de ese repo).

## Comandos

| Comando             | Qué hace                                       |
| ------------------- | ---------------------------------------------- |
| `pnpm build`        | Compila todos los paquetes (`turbo run build`) |
| `pnpm dev`          | Compila en modo watch                          |
| `pnpm lint`         | ESLint en todos los paquetes                   |
| `pnpm format`       | Formatea todo el repo con Prettier             |
| `pnpm format:check` | Verifica formato sin escribir cambios          |
| `pnpm test`         | Ejecuta Vitest en todos los paquetes           |

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) ejecuta en cada PR: lint, format
check, test y build. En cada push a `main`, además publica `@hwe-platform/core-ui` a
GitHub Packages.

## Estándares

Este repo sigue los estándares definidos en `hwe-tools` (ver `CLAUDE.md`).
