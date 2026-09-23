import dynamic from 'next/dynamic';

import { mediaTextBlockSchema } from './media-text.schema';
import { MediaEmbed } from './MediaEmbed';
import { MediaImage } from './MediaImage';
import { Eyebrow } from '../../primitives/Eyebrow';
import { RichText } from '../../primitives/RichText';
import { BlockCtas, fondoDe } from '../seccion';
import { cn } from '../../lib/cn';
import { normalizePayloadData } from '../../payload/normalize-payload-data';
import { COLUMNAS_RETICULA, columnasDe } from './ratio';

import type { ComponentType } from 'react';
import type {
  MediaSlotProps,
  MediaTextData,
  MediaTextLabels,
  MediaTextSlots,
} from './media-text.types';

/**
 * `MediaCarousel` bajo demanda — tira de `CarouselPrimitive`, que tira de
 * Swiper. `media-text` es de los bloques más usados del catálogo, así que un
 * `import` estático aquí cargaría Swiper en **cualquier** página con un solo
 * bloque de imagen o de embed. Mismo patrón que `slider`/`slider-thumbs` en
 * `GalleryBlock` (HU-011), y por el mismo motivo: un `export … from` estático
 * en cualquier barril que cuelgue de `core-ui/src/index.ts` evalúa el módulo
 * entero, así que tampoco se reexporta desde `blocks/media-text/index.ts`.
 */
const MediaCarousel = dynamic(() => import('./MediaCarousel').then((m) => m.MediaCarousel));

/**
 * Tipo de medio → componente.
 *
 * **Eje estructural**, así que va por mapa: una `<img>`, un `<iframe>` y una
 * galería con estado no comparten anatomía, y resolverlos con un `if` los
 * mezclaría en un componente que hace tres cosas.
 */
const MEDIOS: Record<string, ComponentType<MediaSlotProps>> = {
  image: MediaImage,
  embed: MediaEmbed,
  carousel: MediaCarousel,
};

/** Rótulos por defecto, en el idioma del primer site. */
const ROTULOS: MediaTextLabels = {
  previous: 'Image précédente',
  next: 'Image suivante',
  embed: 'Contenu intégré',
};

/** Props de {@link MediaTextBlock}. */
export type MediaTextProps = MediaTextSlots & {
  /** Datos del bloque desde Payload, sin validar. */
  data: unknown;
  /** Rótulos de interfaz. Por defecto, en francés. */
  labels?: Partial<MediaTextLabels>;
};

/** La columna de texto: etiqueta, titular, cuerpo, slot y botones. */
function Texto({
  data,
  aside,
  clases,
}: {
  data: MediaTextData;
  aside?: MediaTextSlots['aside'];
  clases: string;
}) {
  return (
    <div className={clases}>
      {data.subtitle ? (
        <Eyebrow className="mb-4" rule={data.eyebrowRule}>
          {data.subtitle}
        </Eyebrow>
      ) : null}
      {/* El titular va en color de marca en todo el export, y se parte en dos
          con la segunda línea en acento cuando el editor rellena `titleAccent`. */}
      {data.title || data.titleAccent ? (
        <h2 className="text-primary mb-6">
          {data.title}
          {data.titleAccent ? (
            <span className="text-secondary mt-2 block">{data.titleAccent}</span>
          ) : null}
        </h2>
      ) : null}
      {data.content ? (
        // Cuerpo normal, con el ritmo entre párrafos del diseño.
        //
        // **No se fija aquí el «párrafo destacado»** del lenguaje visual: su tamaño
        // varía por sección —22px con peso medio en la intro, 20px en Piscine, 18px
        // en Restaurant— así que es un eje, no un valor. Fijarlo aquí acertaba en
        // una de tres. Pendiente de decisión del Planner (ver HU-009).
        <RichText
          content={data.content}
          className="text-muted-foreground [&>p:first-child]:mt-0 [&>p]:mt-6"
        />
      ) : null}

      {aside ? <div className="mt-8">{aside}</div> : null}

      <BlockCtas ctas={data.ctas} className="mt-8" />
    </div>
  );
}

/**
 * Medio y texto en dos columnas.
 *
 * Es el bloque que más secciones cubre del catálogo: siete de las tres páginas
 * analizadas, con tres repartos distintos, los tres tipos de medio y las dos
 * orientaciones. Sus ejes salen de comparar esas siete, no de imaginarlas.
 *
 * `split` es el número de columnas que ocupa el medio sobre doce, **no una
 * enumeración de los repartos vistos**: La Civelle ya usa tres valores, y fijar
 * la lista se rompería con el primer cliente que quiera otro.
 *
 * @example
 * <MediaTextBlock data={bloque} aside={<Horarios />} sobreLaImagen={<Insignia />} />
 */
export function MediaTextBlock({ data, aside, sobreLaImagen, labels }: MediaTextProps) {
  // El BlockRenderer ya normaliza, pero el bloque se puede usar fuera de él,
  // y un dato crudo de Payload —con sus `null`— dejaría la sección en blanco.
  // Normalizar dos veces es idempotente y barato.
  const resultado = mediaTextBlockSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('MediaText: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const bloque = resultado.data;
  const Medio = MEDIOS[bloque.media];
  const rotulos = { ...ROTULOS, ...labels };
  const columnasMedio = columnasDe(bloque.split);
  const columnasTexto = columnasDe(COLUMNAS_RETICULA - bloque.split);

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', fondoDe(bloque.background))}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'grid grid-cols-1 gap-10 md:gap-16 lg:grid-cols-12 lg:gap-24',
            bloque.align === 'center' ? 'items-center' : 'items-start',
          )}
        >
          {/* `relative` es lo que sostiene el adorno flotante del slot. */}
          <div
            className={cn(
              'relative',
              columnasMedio,
              bloque.reverse ? 'order-1 lg:order-2' : 'order-1',
            )}
          >
            {Medio ? <Medio data={bloque} labels={rotulos} /> : null}
            {sobreLaImagen}
          </div>

          <Texto
            data={bloque}
            aside={aside}
            clases={cn(columnasTexto, bloque.reverse ? 'order-2 lg:order-1' : 'order-2')}
          />
        </div>
      </div>
    </section>
  );
}
