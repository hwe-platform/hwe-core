import { BlogBlock } from '../blocks/blog';
import { CardGridBlock } from '../blocks/card-grid';
import { CtaBlock } from '../blocks/cta';
import { GalleryBlock } from '../blocks/gallery';
import { IconGridBlock } from '../blocks/icon-grid';
import { MediaTextBlock } from '../blocks/media-text';
import { RichTextBlock } from '../blocks/rich-text';

import type { BlockRegistry } from './types';

/**
 * Bloques que la plataforma sabe renderizar.
 *
 * Arrancó con los dos que no dependen de ningún diseño concreto —`rich-text`
 * pinta el contenido del editor y `cta` es un título con botones— y se va
 * llenando conforme se construyen desde el Figma.
 *
 * El hero **no está aquí a propósito**: no es un bloque del array `blocks`,
 * sino un grupo de campos de `pages`, así que lo invoca la plantilla de página
 * directamente y no pasa por el registry.
 *
 * Las claves van en kebab-case porque es como Payload guarda el `blockType`.
 */
export const blockRegistry: BlockRegistry = {
  'rich-text': RichTextBlock,
  cta: CtaBlock,
  'media-text': MediaTextBlock,
  'icon-grid': IconGridBlock,
  'card-grid': CardGridBlock,
  blog: BlogBlock,
  gallery: GalleryBlock,
};
