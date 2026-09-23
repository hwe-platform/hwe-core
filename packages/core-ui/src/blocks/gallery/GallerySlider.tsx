'use client';

import { useEffect, useRef } from 'react';

import { CarouselPrimitive, CarouselSlide } from '../../primitives/carousel';
import { GallerySlideFigure } from './GallerySlideFigure';
import { proporcionDe } from './proporciones';
import { cn } from '../../lib/cn';

import type { CarouselInstance } from '../../primitives/carousel';
import type { GalleryVariantProps } from './gallery.types';

/**
 * Carrusel horizontal clásico: flechas, dots y autoplay opcional.
 *
 * Uso: galerías generales (home, servicios, entorno) — es la variante que
 * cubre más casos, por eso es el `default` del schema.
 *
 * **El `useEffect` con `swiper.update()` no es cosmético.** Cargado vía
 * `next/dynamic` dentro de una página con SSR, Swiper puede medir sus slides
 * **antes** de que React termine de montarlas en el DOM: `slidesGrid` sale
 * `[]` y el carrusel queda en blanco aunque las imágenes estén ahí. No es
 * hipotético — pasó en la demo de HU-011 con las tres instancias que se
 * montaban solas; la única que no lo sufría (`GallerySliderThumbs`) se
 * «autocuraba» porque su prop `thumbs` cambia de `null` a una instancia justo
 * después de montar, y ese segundo render fuerza a Swiper a remedir. Aquí no
 * hay una segunda prop que cambie sola, así que se pide la remedición a mano,
 * una vez, tras montar.
 */
export function GallerySlider({ bloque }: GalleryVariantProps) {
  const swiperRef = useRef<CarouselInstance | null>(null);

  useEffect(() => {
    swiperRef.current?.update();
  }, []);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', proporcionDe(bloque.aspectRatio))}>
      <CarouselPrimitive
        navigation={bloque.showArrows}
        pagination={bloque.showDots}
        keyboard
        autoplay={bloque.autoplay}
        autoplayDelay={bloque.autoplayDelay}
        loop={bloque.loop}
        effect={bloque.effect}
        slidesPerView={bloque.slidesPerView}
        spaceBetween={16}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
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
  );
}
