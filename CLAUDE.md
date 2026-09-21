# Claude Code


## Reglas inamovibles

Estas reglas se aplican siempre, sin excepciones, en cada tarea:

1. **NUNCA inventes contenido.** Si necesitas texto de ejemplo, cópialo
   literalmente del Figma export o del `analisis-figma.md`. Si no existe
   la fuente, pregunta al humano antes de inventar.

2. **NUNCA mergees ni marques una historia como hecha** sin que el humano
   haya visto el resultado en el navegador y lo haya comparado con el Figma.

3. **NUNCA crees historias (HU-XXX), skills ni decisiones (DEC-XXX) nuevas.**
   Solo el Planner (claude.ai) las crea. Si detectas que falta algo,
   repórtalo al humano — no lo crees tú.

4. **SIEMPRE presenta tu plan ANTES de implementar.** Espera la aprobación
   del humano. Nunca empieces con "ya lo hice, ¿te parece bien?"

5. **Si encuentras un problema de arquitectura** (algo que afecta a cómo
   funciona el sistema, no solo al código de la tarea), PARA y repórtalo.
   No lo resuelvas tú — es decisión de nivel 3.

6. **Verificación visual obligatoria.** Toda tarea que toca el frontend
   necesita que el humano vea el resultado en localhost y lo compare con
   el Figma antes de commitear a main.

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
