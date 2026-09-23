import { blockRegistry as platformRegistry } from '@hwe-platform/core-ui';

import { IconGridBlock } from './blocks/icon-grid';

import type { BlockRegistry } from '@hwe-platform/core-ui';

/**
 * Registry de bloques del site-demo.
 *
 * Extiende el de plataforma con los overrides propios de este site. El único
 * de hoy es `icon-grid`, y no porque su diseño sea distinto: es el bloque de
 * plataforma con los iconos propios del cliente enchufados. El resto salen de
 * `@hwe-platform/core-ui` tal cual, que es el caso mayoritario que describe
 * docs/arquitectura/bloques.md.
 *
 * Para sustituir un bloque, se añade aquí con la misma clave y gana sobre el de
 * plataforma:
 *
 * ```ts
 * import { MediaTextBlock } from './blocks/media-text';
 * export const blockRegistry: BlockRegistry = { ...platformRegistry, 'media-text': MediaTextBlock };
 * ```
 *
 * El hero **no va aquí**: no es un bloque del array `blocks` sino un grupo de
 * campos de `pages`, y lo pinta la plantilla de página directamente.
 */
export const blockRegistry: BlockRegistry = {
  ...platformRegistry,
  'icon-grid': IconGridBlock,
};
