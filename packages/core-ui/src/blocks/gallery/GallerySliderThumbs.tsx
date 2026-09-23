'use client';

import { useEffect, useRef, useState } from 'react';

import { CarouselPrimitive, CarouselSlide } from '../../primitives/carousel';
import { GallerySlideFigure } from './GallerySlideFigure';
import { Image } from '../../primitives/Image';
import { mediaUrl } from '../../lib/media';
import { proporcionDe } from './proporciones';
import { cn } from '../../lib/cn';

import type { CarouselInstance } from '../../primitives/carousel';
import type { GalleryImage, GalleryVariantProps } from './gallery.types';

/** Miniaturas visibles a la vez en la barra. El Figma usa 3 en móvil y 6 en desktop. */
const MINIATURAS_POR_VISTA = 5;

/** Props de una miniatura: la imagen y si es la que corresponde a la slide activa. */
type MiniaturaProps = { item: GalleryImage; indice: number; activa: boolean };

/**
 * Una miniatura de la barra.
 *
 * Fuera de `GallerySliderThumbs` porque meter el JSX del botón ahí subía la
 * función a 56 líneas, por encima del límite de `codigo.md` — sin ninguna
 * decisión propia que justifique vivir dentro del componente.
 *
 * Botón real y no un `div` con click: el módulo Thumbs sincroniza con el
 * ratón, pero el teclado necesita un elemento operable — el click de Swiper
 * sube por burbuja desde el botón igual.
 */
function Miniatura({ item, indice, activa }: MiniaturaProps) {
  return (
    <button
      type="button"
      aria-label={`Aller à la photo ${indice + 1}`}
      aria-current={activa}
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-xl border-[3px]',
        activa ? 'border-secondary' : 'border-transparent opacity-70',
      )}
    >
      <Image src={mediaUrl(item.image, 'thumbnail') ?? ''} alt="" fill className="object-cover" />
    </button>
  );
}

/**
 * Carrusel con barra de miniaturas sincronizada debajo — la variante estrella
 * en hospitality, para fichas de alojamiento. Es la única con referencia
 * directa en el Figma (`MobileHomePage.tsx`), aunque ahí las miniaturas son
 * una rejilla estática y aquí son un segundo Swiper: HU-011 pide **dos
 * instancias conectadas por el módulo Thumbs**, no la rejilla del export.
 * Listado en «Diferencias con lo que pide esta historia».
 *
 * El estado activo se lleva a mano —`activo`, vía `onSlideChange`— en vez de
 * confiar en la clase `swiper-slide-thumb-active` de Swiper: así el borde
 * dorado de la miniatura activa sale con los tokens del cliente y no con CSS
 * global sin scoping.
 *
 * **Los dos `useEffect` con `.update()` no son cosmética.** Cargado vía
 * `next/dynamic` dentro de una página con SSR, Swiper puede medir sus slides
 * antes de que React las termine de montar y quedarse con `slidesGrid: []` —
 * pasó de verdad en la demo de HU-011. El carrusel principal solo se
 * «autocuraba» porque su prop `thumbs` cambia de `null` a una instancia justo
 * después de montar, y ese segundo render fuerza a Swiper a remedir — pero
 * con una sola imagen las miniaturas no llegan a montarse (la condición de
 * abajo) y esa cura nunca ocurre. Se pide la remedición a mano en los dos
 * carruseles, una vez cada uno, en vez de depender de que el otro cambie.
 */
export function GallerySliderThumbs({ bloque }: GalleryVariantProps) {
  const [miniaturas, setMiniaturas] = useState<CarouselInstance | null>(null);
  const [activo, setActivo] = useState(0);
  const principalRef = useRef<CarouselInstance | null>(null);

  useEffect(() => {
    principalRef.current?.update();
  }, []);

  useEffect(() => {
    miniaturas?.update();
  }, [miniaturas]);

  return (
    <div className="space-y-4">
      <div className={cn('relative overflow-hidden rounded-2xl', proporcionDe(bloque.aspectRatio))}>
        <CarouselPrimitive
          navigation={bloque.showArrows}
          keyboard
          loop={bloque.loop}
          thumbs={miniaturas}
          onSlideChange={setActivo}
          onSwiper={(swiper) => {
            principalRef.current = swiper;
          }}
          className="h-full"
        >
          {bloque.images.map((item, indice) => (
            <CarouselSlide key={`${item.alt}-${indice}`}>
              <GallerySlideFigure item={item} indice={indice} priority={indice === 0} />
            </CarouselSlide>
          ))}
        </CarouselPrimitive>
      </div>

      {bloque.images.length > 1 ? (
        <CarouselPrimitive
          onSwiper={setMiniaturas}
          slidesPerView={Math.min(MINIATURAS_POR_VISTA, bloque.images.length)}
          spaceBetween={12}
          loop={false}
          labels={{ region: 'Miniatures' }}
        >
          {bloque.images.map((item, indice) => (
            <CarouselSlide key={`${item.alt}-${indice}`}>
              <Miniatura item={item} indice={indice} activa={activo === indice} />
            </CarouselSlide>
          ))}
        </CarouselPrimitive>
      ) : null}
    </div>
  );
}
