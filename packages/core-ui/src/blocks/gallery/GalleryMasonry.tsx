import { GalleryFigure } from './GalleryFigure';
import { columnasDe } from './proporciones';
import { cn } from '../../lib/cn';

import type { GalleryVariantProps } from './gallery.types';

/**
 * Grid tipo Pinterest: cada foto mantiene su proporción original y cae en la
 * columna que le toca según su alto real.
 *
 * **Ignora `aspectRatio` a propósito.** Es la única variante que lo hace: la
 * guía del bloque antiguo la define por «las imágenes mantienen su proporción
 * original», que es justo lo que una relación de aspecto fija destruiría. Un
 * `aspectRatio: '16/9'` en el editor no tiene efecto aquí — todas las fotos
 * saldrían recortadas al mismo alto, que es lo que hace `grid`, no `masonry`.
 *
 * `break-inside-avoid` es imprescindible con `columns-*`: sin él, el navegador
 * puede partir una foto entre dos columnas.
 */
export function GalleryMasonry({ bloque }: GalleryVariantProps) {
  return (
    <div className={cn(columnasDe(bloque.columns), 'gap-4 [column-fill:balance] md:gap-6')}>
      {bloque.images.map((item, indice) => (
        <GalleryFigure
          key={`${item.alt}-${indice}`}
          item={item}
          indice={indice}
          aspectRatio="auto"
          priority={indice < bloque.columns}
          className="mb-4 break-inside-avoid md:mb-6"
        />
      ))}
    </div>
  );
}
