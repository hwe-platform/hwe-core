import type { ComponentType } from 'react';

/**
 * Registry de bloques del site-demo. Vacío por ahora — `blockRegistry` de
 * `@hwe-platform/core-ui` todavía no existe (llega en HU-008). Cuando exista,
 * este archivo lo importa y extiende con los overrides propios del site-demo,
 * siguiendo el patrón de docs/arquitectura/bloques.md ("Registry del cliente").
 */
export const blockRegistry: Record<string, ComponentType<{ data: unknown }>> = {};
