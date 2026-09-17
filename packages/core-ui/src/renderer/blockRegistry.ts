import { CtaBlock } from '../blocks/cta';
import { RichTextBlock } from '../blocks/rich-text';

import type { BlockRegistry } from './types';

/**
 * Bloques que la plataforma sabe renderizar.
 *
 * Arranca con los dos que no dependen de ningún diseño concreto: `rich-text`
 * pinta el contenido del editor y `cta` es un título con botones. El resto se
 * añaden conforme se construyen desde el Figma (HU-009 en adelante).
 *
 * Las claves van en kebab-case porque es como Payload guarda el `blockType`.
 */
export const blockRegistry: BlockRegistry = {
  'rich-text': RichTextBlock,
  cta: CtaBlock,
};
