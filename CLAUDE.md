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

7. **Calidad desde el inicio.** Lee los estándares ANTES de implementar,
   aplica las reglas MIENTRAS escribes, ejecuta lint y tests DURANTE el
   desarrollo (no solo al final). Antes de entregar:
   - `pnpm lint && pnpm format:check && pnpm test && pnpm build`
   - Si todo verde → lanza el Reviewer (`.claude/agents/reviewer.md`)
   - `/security-review` solo cuando la historia toca inputs, auth,
     headers, iframes o sanitización
   - Si el Reviewer encuentra errores, corrígelos y repite solo el Reviewer

   **Reviewer por bloque, no por historia.** Si la historia tiene varios
   bloques o componentes independientes, lanza el Reviewer al terminar cada
   uno — no al final con 20 ficheros de golpe. Una lista de 3 hallazgos se
   corrige sin meter errores nuevos; una de 12 no. La pasada final de cierre
   solo revisa lo que no se ve desde un bloque aislado.

8. **Antes de implementar un bloque, verifica su spec.** Comprueba que
   existe su archivo en `docs/specs/` con el formato de
   `docs/specs/_template-bloque.md`. Si está vacío o no existe, rellénalo
   desde la HU antes de escribir código. Si durante la implementación
   algo cambia respecto a la spec, actualízala al terminar.

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
- `docs/docs/estandares/seguridad.md`, `seo.md` — reglas de seguridad y SEO en código

## Actualizar el submodule

`docs/` se actualiza de forma independiente al historial de `hwe-core`:

```bash
git submodule update --remote docs
```

## Qué NO leer

- Documentos vacíos (solo tienen el título): `seguridad.md` tiene contenido ahora,
  pero `mejora-continua.md` y algunas specs de hitos futuros siguen vacías — no las cargues
- Archivos de hitos futuros (personalización, contenido-IA) — no son relevantes para el Hito 1
- No cargues todo `docs/` a la vez — lee solo lo que la tarea pide

## Agentes

El Reviewer y el Researcher son subagentes ejecutables de Claude Code.
Viven en `.claude/agents/` con frontmatter YAML.

- **Reviewer** — valida contra estándares. Lo dispara la regla 7.
- **Researcher** (Haiku) — busca en el repo y devuelve resumen corto.
  Invócalo cuando necesites localizar código sin cargar archivos enteros
  en tu contexto.

Los demás roles no se ejecutan como subagentes:

- **Planner** (Opus) opera desde claude.ai
- **Code Builder** es la propia sesión de Claude Code
- Las definiciones de todos los roles están en `docs/.claude/agentes/`

## Cuando estés perdido

1. `docs/docs/proyecto.md` — visión del proyecto, stack, hitos
2. `docs/docs/decisiones/` — decisiones ya tomadas (DEC-001 a DEC-009)
3. `docs/docs/arquitectura/bloques.md` — cómo funciona el sistema de bloques
4. `docs/specs/payload/modelo-datos.md` — modelo de datos de Payload
5. `docs/historias/index.md` — cola de prioridades, qué hay que hacer
