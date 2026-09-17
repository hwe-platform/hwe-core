import { blockRegistry as platformRegistry } from '@hwe-platform/core-ui';

import type { BlockRegistry } from '@hwe-platform/core-ui';

/**
 * Registry de bloques del site-demo.
 *
 * Extiende el de plataforma con los overrides propios de este site. Hoy no hay
 * ninguno: todos los bloques salen de `@hwe-platform/core-ui` tal cual, que es
 * el caso mayoritario que describe docs/arquitectura/bloques.md.
 *
 * Para sustituir un bloque, se añade aquí con la misma clave y gana sobre el de
 * plataforma:
 *
 * ```ts
 * import { HeroBlock } from './blocks/hero';
 * export const blockRegistry: BlockRegistry = { ...platformRegistry, hero: HeroBlock };
 * ```
 */
export const blockRegistry: BlockRegistry = { ...platformRegistry };
