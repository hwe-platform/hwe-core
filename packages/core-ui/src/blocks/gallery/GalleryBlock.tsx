import dynamic from 'next/dynamic';

import { galleryBlockSchema } from './gallery.schema';
import { GalleryGrid } from './GalleryGrid';
import { GalleryMasonry } from './GalleryMasonry';
import { GalleryCollage } from './GalleryCollage';
import { GalleryLightboxProvider } from './GalleryLightboxProvider';
import { BlockCtas, Cabecera, fondoDe } from '../seccion';
import { cn } from '../../lib/cn';
import { normalizePayloadData } from '../../payload/normalize-payload-data';

import type { ComponentType } from 'react';
import type { GalleryData, GalleryVariantProps } from './gallery.types';

/**
 * `slider` y `slider-thumbs`, cargados bajo demanda.
 *
 * `GalleryGrid`, `GalleryMasonry` y `GalleryCollage` son imports normales
 * arriba: son CSS puro y no cuesta nada tenerlos siempre. Estas dos tiran de
 * `CarouselPrimitive`, que tira de Swiper — con import estático, **cualquier**
 * página que use Gallery cargaría Swiper aunque solo tuviera un `grid`, y
 * peor: `blocks/gallery` cuelga del barril principal de `core-ui`
 * (`src/index.ts`), así que un import estático aquí habría vuelto a romper
 * `payload generate:types` y `migrate:create` —el mismo
 * `ERR_UNKNOWN_FILE_EXTENSION` con `swiper.css` que ya se arregló una vez
 * para el carrusel solo, y que el barril de Gallery reabría por su cuenta—.
 *
 * `next/dynamic` con `.then((m) => m.X)` porque el módulo exporta con nombre,
 * no por defecto, como todo lo demás del catálogo.
 */
const GallerySlider = dynamic(() => import('./GallerySlider').then((m) => m.GallerySlider));
const GallerySliderThumbs = dynamic(() =>
  import('./GallerySliderThumbs').then((m) => m.GallerySliderThumbs),
);

/**
 * Anatomía → componente.
 *
 * **Eje estructural**, resuelto por mapa: `grid`, `masonry` y `collage` son
 * CSS puro y no cargan Swiper; `slider` y `slider-thumbs` van por
 * `CarouselPrimitive`. Ninguna importa `swiper` directamente — HU-011 lo
 * exige, y es lo que hace posible que las tres primeras nunca lo carguen.
 */
const VARIANTES: Record<string, ComponentType<GalleryVariantProps>> = {
  slider: GallerySlider,
  'slider-thumbs': GallerySliderThumbs,
  grid: GalleryGrid,
  masonry: GalleryMasonry,
  collage: GalleryCollage,
};

export type GalleryProps = {
  /** Dato crudo del bloque, tal como llega de Payload. */
  data: unknown;
};

/**
 * Galería de imágenes con cinco variantes y lightbox.
 *
 * El bloque con más variantes del catálogo y uno de los de mayor impacto SEO
 * para hospitality — Google Images es fuente de tráfico significativa para
 * campings y hoteles.
 *
 * **No consulta Payload.** Las imágenes llegan resueltas en el dato: `core-ui`
 * es una librería de UI y acoplarla al CMS rompería el modelo.
 *
 * @example
 * <GalleryBlock data={bloque} />
 */
export function GalleryBlock({ data }: GalleryProps) {
  const resultado = galleryBlockSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('Gallery: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const bloque = resultado.data as GalleryData;
  const Variante = VARIANTES[bloque.variant];
  // El schema lo guarda como string, igual que el resto de selects del
  // catálogo (ver su JSDoc en pages.schema.ts); `Cabecera` lo quiere numérico.
  const nivelTitular = Number(bloque.headingLevel) as 2 | 3 | 4;

  if (!Variante) return null;

  // El proveedor no se monta si el bloque no quiere lightbox: sin él,
  // `useGalleryLightbox()` devuelve `null` en cada figura, y ninguna se
  // envuelve en botón — ver el porqué en `GalleryLightboxProvider`.
  const contenido = <Variante bloque={bloque} />;

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', fondoDe(bloque.background))}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Cabecera title={bloque.title} description={bloque.description} level={nivelTitular} />

        {bloque.lightbox ? (
          <GalleryLightboxProvider images={bloque.images}>{contenido}</GalleryLightboxProvider>
        ) : (
          contenido
        )}

        <BlockCtas ctas={bloque.ctas} className="mt-12" />
      </div>
    </section>
  );
}
