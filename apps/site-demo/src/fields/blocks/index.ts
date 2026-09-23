import { Blog } from './blog';
import { CardGrid } from './card-grid';
import { Cta } from './cta';
import { Gallery } from './gallery';
import { IconGrid } from './icon-grid';
import { MediaText } from './media-text';
import { RichText } from './rich-text';

import type { Block, Field } from 'payload';

/**
 * Bloques disponibles en un `blocks` field.
 *
 * Sus campos son el espejo de los schemas Zod de core-ui
 * (`pages.schema.ts`), que es la fuente de verdad. Cada bloque vive en su
 * propio módulo: juntos se pasaban del límite de líneas de `codigo.md`, y el
 * catálogo todavía tiene que crecer.
 */

/** Los bloques que el editor puede insertar hoy. */
export const contentBlocks: Block[] = [MediaText, IconGrid, CardGrid, Blog, Gallery, RichText, Cta];

/** Campo `blocks` listo para usar en `pages` y en la ficha de `accommodations`. */
export const blocksField: Field = {
  name: 'blocks',
  type: 'blocks',
  blocks: contentBlocks,
  admin: { description: 'Secciones de la página, en el orden en que se pintan.' },
};
