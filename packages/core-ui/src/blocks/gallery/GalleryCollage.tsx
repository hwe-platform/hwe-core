import { GalleryFigure } from './GalleryFigure';

import type { GalleryVariantProps } from './gallery.types';

/**
 * Una imagen grande destacada + varias pequeñas alrededor. CSS Grid: la
 * primera imagen ocupa dos columnas y dos filas, el resto cae en las celdas
 * que quedan.
 *
 * Sin referencia en el Figma de La Civelle — se construye desde la historia,
 * sin comparación visual posible. El humano la verifica en el navegador
 * (regla 6) igual que el resto, pero no contra un export que no existe.
 */
export function GalleryCollage({ bloque }: GalleryVariantProps) {
  const [destacada, ...resto] = bloque.images;

  if (!destacada) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <GalleryFigure
        item={destacada}
        indice={0}
        aspectRatio={bloque.aspectRatio}
        priority
        className="col-span-2 row-span-2"
      />
      {resto.map((item, indice) => (
        <GalleryFigure
          key={`${item.alt}-${indice}`}
          item={item}
          indice={indice + 1}
          aspectRatio={bloque.aspectRatio}
        />
      ))}
    </div>
  );
}
