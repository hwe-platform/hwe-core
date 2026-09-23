'use client';

import { Image } from '../../primitives/Image';
import { mediaAlt, mediaUrl } from '../../lib/media';
import { useGalleryLightbox } from './gallery-lightbox-context';

import type { GalleryImage } from './gallery.types';

export type GallerySlideFigureProps = {
  item: GalleryImage;
  /** Su posición en `images` — con qué foto abre el lightbox al pulsarla. */
  indice: number;
  priority?: boolean;
};

/**
 * Una imagen dentro de una slide de carrusel.
 *
 * Distinta de `GalleryFigure`: esa se da su propio marco de proporción fija;
 * esta llena el hueco que ya le da Swiper —la slide mide lo que mide el
 * carrusel—, así que va con `fill` y sin contenedor de aspecto propio. Las
 * comparten `alt` y `caption`, pero no el marcado alrededor.
 *
 * El botón del lightbox cubre toda la slide (`absolute inset-0`) y no
 * interfiere con el arrastre de Swiper: distingue clic de swipe por su
 * cuenta, igual que cualquier tarjeta clicable dentro de un carrusel.
 */
export function GallerySlideFigure({ item, indice, priority = false }: GallerySlideFigureProps) {
  const abrir = useGalleryLightbox();
  const src = mediaUrl(item.image, 'hero');

  if (!src) return null;

  const alt = item.alt || mediaAlt(item.image);

  return (
    <figure className="relative h-full w-full">
      <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
      {abrir ? (
        <button
          type="button"
          onClick={() => abrir(indice)}
          aria-label={`Agrandir : ${alt}`}
          className="absolute inset-0 cursor-zoom-in"
        />
      ) : null}
      {item.caption ? (
        <figcaption className="text-primary-foreground pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4 text-sm">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
