import { cardGridBlockSchema } from './card-grid.schema';
import { CardOverlay } from './CardOverlay';
import { CardStacked } from './CardStacked';
import { reticulaDe } from '../icon-grid/grid';
import { columnasDe } from '../media-text/ratio';
import { BlockCtas, Cabecera, fondoDe } from '../seccion';
import { cn } from '../../lib/cn';
import { normalizePayloadData } from '../../payload/normalize-payload-data';

import type { ComponentType } from 'react';
import type { CardGridData, CardProps } from './card-grid.types';

/**
 * Anatomía → componente.
 *
 * **Eje estructural**, así que va por mapa: el texto sobre la imagen vive en
 * posición absoluta sobre un degradado y el texto debajo va en flujo normal.
 * No comparten esqueleto, y resolverlo con un `if` los mezclaría.
 */
const TARJETAS: Record<string, ComponentType<CardProps>> = {
  overlay: CardOverlay,
  stacked: CardStacked,
};

export type CardGridProps = {
  /** Dato crudo del bloque, tal como llega de Payload. */
  data: unknown;
};

/**
 * Rejilla de tarjetas con imagen.
 *
 * Cubre cinco secciones del diseño de referencia. Lo que varía de verdad es la
 * anatomía de la tarjeta y cuántas caben en una fila; el reparto asimétrico de
 * «Nos Hébergements» sale del mismo eje, expresado en columnas de doce.
 *
 * **No consulta Payload.** `source` y `sourceConfig` viajan en el dato para
 * que el editor diga qué quiere, pero quien lo resuelve es el site: `core-ui`
 * es una librería de UI y acoplarla al CMS rompería el modelo.
 *
 * @example
 * <CardGridBlock data={bloque} />
 */
export function CardGridBlock({ data }: CardGridProps) {
  const resultado = cardGridBlockSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('CardGrid: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const bloque = resultado.data;
  const Tarjeta = TARJETAS[bloque.card];

  if (!Tarjeta) return null;

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', fondoDe(bloque.background))}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Cabecera
          subtitle={bloque.subtitle}
          title={bloque.title}
          description={bloque.description}
          tone={bloque.headingTone}
        />

        <div className={cn(reticula(bloque), 'gap-8 md:gap-10')}>
          {bloque.items.map((item, i) => (
            <Tarjeta
              key={`${item.title}-${i}`}
              item={item}
              className={columnaDe(bloque, i)}
              size={bloque.cardSize}
            />
          ))}
        </div>

        <BlockCtas ctas={bloque.ctas} className="mt-12" />
      </div>
    </section>
  );
}

/**
 * La retícula de la sección: uniforme, o de doce columnas si hay reparto.
 *
 * Las doce columnas de Tailwind son lo único que permite que dos tarjetas
 * midan 5 y 7; sin reparto manda el número de columnas y la rampa sale de
 * `icon-grid`, que ya la resolvió.
 *
 * El reparto asimétrico llega en `lg` y no en `md` como el export, **a
 * propósito**: allí la rejilla pasa a doce columnas en `md` mientras que los
 * repartos por tarjeta solo existen en `lg`, así que entre los dos tamaños
 * cada tarjeta ocupa una de doce columnas y queda en una astilla. Es un
 * defecto del diseño exportado, de los que DEC-002 dice que no se copian.
 */
function reticula(bloque: CardGridData): string {
  return bloque.spans.length > 0 ? 'grid grid-cols-1 lg:grid-cols-12' : reticulaDe(bloque.columns);
}

/**
 * Columna que ocupa una tarjeta en un reparto asimétrico.
 *
 * El reparto se recorre en ciclo, así que una lista de dos valores vale para
 * cuatro tarjetas. Sin reparto no devuelve clase: la rejilla ya es uniforme.
 */
function columnaDe(bloque: CardGridData, indice: number): string | undefined {
  if (bloque.spans.length === 0) return undefined;

  return columnasDe(bloque.spans[indice % bloque.spans.length]);
}
