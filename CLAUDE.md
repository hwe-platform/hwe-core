# Claude Code

Este repo forma parte del proyecto HWE. La documentación de referencia, las
historias de usuario, los estándares y los archivos operativos viven en
`docs/` — un git submodule que apunta a `hwe-tools`. Léelos directamente
desde ahí, no los dupliques.

Antes de implementar código en `hwe-core`, consulta en `docs/`:

- `docs/docs/estandares/codigo.md`, `naming.md`, `commits.md`, `testing.md`,
  `herramientas.md` — estándares de código, nombrado, git y testing
- `docs/historias/` — la historia de usuario (HU-XXX) que estés implementando
- `docs/docs/decisiones/` — decisiones de arquitectura (DEC-XXX), en particular
  `DEC-007-repos.md` sobre por qué existen tres repositorios
- `docs/.claude/agentes/code-builder.md` — flujo de trabajo del Code Builder
- `docs/specs/` — specs de producto (modelo de datos, bloques, etc.)

## Actualizar el submodule

`docs/` se actualiza de forma independiente al historial de `hwe-core`:

```bash
git submodule update --remote docs
```
