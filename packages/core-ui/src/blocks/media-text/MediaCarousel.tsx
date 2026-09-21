'use client';

import { useState } from 'react';

import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Image } from '../../primitives/Image';
import { mediaUrl, mediaAlt } from '../../lib/media';
import { cn } from '../../lib/cn';
import { PROPORCIONES } from './ratio';

import type { MediaSlotProps } from './media-text.types';

/**
 * Galería con flechas, como las dos de Le Camping.
 *
 * Es el único de los tres medios que necesita estado, y por eso el único
 * marcado como componente de cliente: el bloque y sus otras dos variantes se
 * renderizan en el servidor.
 *
 * Con una sola imagen no pinta controles — unas flechas que no llevan a ningún
 * sitio son peores que ninguna.
 */
export function MediaCarousel({ data, labels }: MediaSlotProps) {
  const imagenes = data.images ?? [];
  const [actual, setActual] = useState(0);

  if (imagenes.length === 0) return null;

  const total = imagenes.length;
  const ir = (paso: number) => setActual((previo) => (previo + paso + total) % total);
  const src = mediaUrl(imagenes[actual], 'card');

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl shadow-2xl', PROPORCIONES[data.ratio])}
    >
      {src ? (
        <Image src={src} alt={mediaAlt(imagenes[actual])} fill className="object-cover" />
      ) : null}

      {total > 1 ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => ir(-1)}
            aria-label={labels.previous}
            className="text-primary absolute left-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-white/90 px-0 shadow-lg"
          >
            <Icon name="chevronLeft" size="sm" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => ir(1)}
            aria-label={labels.next}
            className="text-primary absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full bg-white/90 px-0 shadow-lg"
          >
            <Icon name="chevronRight" size="sm" />
          </Button>
          <p className="text-primary-foreground absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs">
            {actual + 1} / {total}
          </p>
        </>
      ) : null}
    </div>
  );
}
