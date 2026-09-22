import { blogBlockSchema } from './blog.schema';
import { CardStacked } from '../card-grid/CardStacked';
import { reticulaDe } from '../icon-grid/grid';
import { BlockCtas, Cabecera, fondoDe } from '../seccion';
import { cn } from '../../lib/cn';
import { normalizePayloadData } from '../../payload/normalize-payload-data';

/** Cuántas caben en una fila. El diseño de referencia pone tres. */
const COLUMNAS = 3;

export type BlogProps = {
  /** Dato crudo del bloque, con los artículos ya resueltos en `items`. */
  data: unknown;
};

/**
 * Listado de artículos del blog.
 *
 * **El primer bloque de referencia.** No contiene su contenido: lo pide. El
 * editor configura la consulta —los últimos, los destacados, los de una
 * categoría— y el site la resuelve antes de renderizar, porque `core-ui` no
 * habla con Payload.
 *
 * La tarjeta es la misma de `card-grid`: un artículo resuelto no es más que
 * una tarjeta con fecha, y mantener dos tarjetas para lo mismo acabaría en
 * dos diseños distintos.
 *
 * Sin artículos no pinta la sección. Un listado vacío no es una sección
 * vacía: es una sección que sobra.
 *
 * @example
 * <BlogBlock data={{ ...bloque, items: articulosResueltos }} />
 */
export function BlogBlock({ data }: BlogProps) {
  const resultado = blogBlockSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('Blog: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const bloque = resultado.data;
  if (bloque.items.length === 0) return null;

  const verMas =
    bloque.showMoreLink && bloque.showMoreUrl
      ? [
          {
            label: bloque.showMoreLabel ?? '',
            url: bloque.showMoreUrl,
            variant: 'link-underline' as const,
            icon: 'arrowRight',
          },
        ]
      : [];

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', fondoDe(bloque.background))}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Cabecera
          subtitle={bloque.subtitle}
          title={bloque.title}
          description={bloque.description}
          tone={bloque.headingTone}
        />

        <div className={cn(reticulaDe(COLUMNAS), 'gap-8 md:gap-10')}>
          {bloque.items.map((item) => (
            <CardStacked key={item.url ?? item.title} item={item} />
          ))}
        </div>

        <BlockCtas ctas={verMas} className="mt-12" />
      </div>
    </section>
  );
}
