import { GalleryFigure } from './GalleryFigure';
import { reticulaDe } from './proporciones';
import { cn } from '../../lib/cn';

import type { GalleryVariantProps } from './gallery.types';

/**
 * Rejilla regular: todas las fotos al mismo tamaño, reparto uniforme.
 *
 * Uso: listados donde importa ver todo de un vistazo (instalaciones,
 * actividades). No carga Swiper — es CSS puro.
 */
export function GalleryGrid({ bloque }: GalleryVariantProps) {
  return (
    <div className={cn(reticulaDe(bloque.columns), 'gap-4 md:gap-6')}>
      {bloque.images.map((item, indice) => (
        // Las de la primera fila son las visibles sin scroll: mejoran el LCP.
        <GalleryFigure
          key={`${item.alt}-${indice}`}
          item={item}
          indice={indice}
          aspectRatio={bloque.aspectRatio}
          priority={indice < bloque.columns}
        />
      ))}
    </div>
  );
}
