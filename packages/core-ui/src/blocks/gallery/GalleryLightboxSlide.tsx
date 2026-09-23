import { Image } from '../../primitives/Image';
import { mediaAlt, mediaUrl } from '../../lib/media';

import type { GalleryImage } from './gallery.types';

export type GalleryLightboxSlideProps = {
  item: GalleryImage;
  priority?: boolean;
};

/**
 * Una imagen dentro del visor a pantalla completa.
 *
 * `swiper-zoom-container` es la clase que el módulo Zoom de Swiper busca
 * para saber qué envolver: sin ella, `zoom` no tiene nada que ampliar y el
 * pellizco o el doble click no hacen nada.
 */
export function GalleryLightboxSlide({ item, priority = false }: GalleryLightboxSlideProps) {
  const src = mediaUrl(item.image, 'hero');

  if (!src) return null;

  return (
    <div className="relative h-full w-full">
      <div className="swiper-zoom-container absolute inset-0">
        <Image
          src={src}
          alt={item.alt || mediaAlt(item.image)}
          fill
          priority={priority}
          className="object-contain"
        />
      </div>
      {item.caption ? (
        <figcaption className="text-primary-foreground absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 text-center text-sm">
          {item.caption}
        </figcaption>
      ) : null}
    </div>
  );
}
