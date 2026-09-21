import { Image } from '../../primitives/Image';
import { mediaUrl, mediaAlt } from '../../lib/media';
import { cn } from '../../lib/cn';
import { PROPORCIONES } from './ratio';

import type { MediaSlotProps } from './media-text.types';

/**
 * Una sola imagen, enmarcada.
 *
 * El marco lleva el radio grande y la sombra del diseño, y un degradado muy
 * suave desde abajo — no para oscurecer, que aquí no hay texto encima, sino
 * para que la foto no choque con el fondo claro de la sección.
 */
export function MediaImage({ data }: MediaSlotProps) {
  const src = mediaUrl(data.image, 'card');
  if (!src) return null;

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl shadow-2xl', PROPORCIONES[data.ratio])}
    >
      <Image src={src} alt={mediaAlt(data.image)} fill className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
