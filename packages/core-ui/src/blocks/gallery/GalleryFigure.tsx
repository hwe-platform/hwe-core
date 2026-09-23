'use client';

import { Image } from '../../primitives/Image';
import { isPopulatedMedia, mediaAlt, mediaUrl } from '../../lib/media';
import { proporcionDe } from './proporciones';
import { useGalleryLightbox } from './gallery-lightbox-context';
import { cn } from '../../lib/cn';

import type { GalleryImage } from './gallery.types';

export type GalleryFigureProps = {
  item: GalleryImage;
  /** Su posición en `images` — con qué foto abre el lightbox al pulsarla. */
  indice: number;
  /** Proporción del marco. `auto` renderiza al tamaño natural de la imagen. */
  aspectRatio: string;
  /** LCP: la primera imagen visible del viewport no debe esperar a `next/image`. */
  priority?: boolean;
  className?: string;
};

/**
 * Ancho y alto reales de la imagen, para el único caso que los necesita
 * —`aspectRatio: 'auto'`, donde no hay contenedor que reserve el hueco—.
 *
 * Solo existen si Payload pobló el documento (`depth` suficiente); con solo
 * el id no hay dimensiones que ofrecer y el llamante debe caer a otra cosa.
 */
function dimensionesDe(item: GalleryImage): { width: number; height: number } | null {
  if (!isPopulatedMedia(item.image)) return null;
  if (!item.image.width || !item.image.height) return null;

  return { width: item.image.width, height: item.image.height };
}

/**
 * Una imagen de la galería, con su `<figure>` y su `<figcaption>` cuando
 * lleva pie de foto. La comparten las tres variantes estáticas; las de
 * carrusel reutilizan `GallerySlideFigure`, que llena el hueco de una slide
 * en vez de darse su propio marco.
 *
 * El `alt` del bloque **gana siempre** sobre el de `media`: es obligatorio en
 * el schema, así que nunca hace falta caer al genérico del archivo.
 *
 * **Componente de cliente** por `useGalleryLightbox()`, no por nada visual:
 * sigue renderizándose en el servidor como cualquier otro —React sirve el
 * HTML de un componente de cliente igual que el de uno de servidor, y solo
 * la interactividad llega después, al hidratar—. Envolver en botón cuesta
 * esto; no cargar Swiper en `grid`/`masonry`/`collage` seguía sin coste.
 */
export function GalleryFigure({
  item,
  indice,
  aspectRatio,
  priority = false,
  className,
}: GalleryFigureProps) {
  const abrir = useGalleryLightbox();
  const src = mediaUrl(item.image, 'card');

  if (!src) return null;

  const esNatural = aspectRatio === 'auto';
  const dimensiones = esNatural ? dimensionesDe(item) : null;
  const alt = item.alt || mediaAlt(item.image);

  const imagen =
    esNatural && dimensiones ? (
      <Image
        src={src}
        alt={alt}
        width={dimensiones.width}
        height={dimensiones.height}
        priority={priority}
        className="h-auto w-full rounded-2xl"
      />
    ) : (
      <div className={cn('relative overflow-hidden rounded-2xl', proporcionDe(aspectRatio))}>
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
      </div>
    );

  return (
    <figure className={className}>
      {abrir ? (
        <button
          type="button"
          onClick={() => abrir(indice)}
          aria-label={`Agrandir : ${alt}`}
          className="block w-full cursor-zoom-in text-left"
        >
          {imagen}
        </button>
      ) : (
        imagen
      )}
      {item.caption ? (
        <figcaption className="text-muted-foreground mt-2 text-sm">{item.caption}</figcaption>
      ) : null}
    </figure>
  );
}
