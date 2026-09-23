'use client';

import { useRef, useState } from 'react';

import { CarouselPrimitive, CarouselSlide } from '../../primitives/carousel';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Image } from '../../primitives/Image';
import { mediaUrl, mediaAlt } from '../../lib/media';
import { cn } from '../../lib/cn';
import { PROPORCIONES } from './ratio';

import type { RefObject } from 'react';
import type { CarouselInstance } from '../../primitives/carousel';
import type { MediaTextLabels, MediaSlotProps } from './media-text.types';

/** Props de los controles del carrusel: flechas propias y contador de texto. */
type ControlesProps = {
  labels: MediaTextLabels;
  actual: number;
  total: number;
  swiperRef: RefObject<CarouselInstance | null>;
};

/**
 * Flechas en círculo blanco y contador «N / total» — no las de Swiper.
 *
 * Fuera de `MediaCarousel` por lo mismo que `Miniatura` en
 * `GallerySliderThumbs`: meter este JSX ahí subía la función por encima del
 * límite de `codigo.md`, sin ninguna decisión propia que justifique vivir
 * dentro del componente.
 */
function Controles({ labels, actual, total, swiperRef }: ControlesProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label={labels.previous}
        className="text-primary absolute left-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-white/90 px-0 shadow-lg"
      >
        <Icon name="chevronLeft" size="sm" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label={labels.next}
        className="text-primary absolute right-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-white/90 px-0 shadow-lg"
      >
        <Icon name="chevronRight" size="sm" />
      </Button>
      <p className="text-primary-foreground pointer-events-none absolute bottom-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs">
        {actual + 1} / {total}
      </p>
    </>
  );
}

/**
 * Galería con flechas, como las dos de Le Camping.
 *
 * Es el único de los tres medios que necesita estado, y por eso el único
 * marcado como componente de cliente: el bloque y sus otras dos variantes se
 * renderizan en el servidor.
 *
 * Sobre `CarouselPrimitive` (HU-011, migración de cierre): mismo aspecto que
 * siempre —flechas propias en círculo blanco, contador de texto, sin dots—,
 * pero con el patrón ARIA de carrusel y la navegación por teclado que el
 * primitivo trae de serie y la versión anterior no tenía. Las flechas siguen
 * siendo `Button`/`Icon` propios y no las de Swiper —`navigation={false}`, y
 * `slidePrev`/`slideNext` a mano sobre la instancia—, para no arrastrar el
 * estilo por defecto de Swiper sobre un diseño ya aprobado visualmente.
 *
 * Con una sola imagen no pinta controles — unas flechas que no llevan a ningún
 * sitio son peores que ninguna.
 */
export function MediaCarousel({ data, labels }: MediaSlotProps) {
  const imagenes = data.images ?? [];
  const [actual, setActual] = useState(0);
  const swiperRef = useRef<CarouselInstance | null>(null);

  if (imagenes.length === 0) return null;

  const total = imagenes.length;

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl shadow-2xl', PROPORCIONES[data.ratio])}
    >
      <CarouselPrimitive
        keyboard
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={setActual}
        className="h-full"
      >
        {imagenes.map((imagen, indice) => {
          const src = mediaUrl(imagen, 'card');
          return (
            <CarouselSlide key={indice}>
              {src ? (
                <Image
                  src={src}
                  alt={mediaAlt(imagen)}
                  fill
                  priority={indice === 0}
                  className="object-cover"
                />
              ) : null}
            </CarouselSlide>
          );
        })}
      </CarouselPrimitive>

      {total > 1 ? (
        <Controles labels={labels} actual={actual} total={total} swiperRef={swiperRef} />
      ) : null}
    </div>
  );
}
