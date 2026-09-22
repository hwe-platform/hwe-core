import type { BlogData, ConsultaDeBlog, ArticuloResuelto, OpcionesDeTarjeta } from './blog.types';
import type { CardGridItem } from '../card-grid/card-grid.types';

/** Los artículos salen siempre del más reciente al más antiguo. */
const ORDEN = '-publishedAt';

/**
 * Traduce lo que pide el bloque a una consulta de Payload.
 *
 * Es una función pura y vive en `core-ui` a propósito: es donde está la
 * lógica que puede equivocarse —qué filtro lleva cada fuente— y aquí tiene
 * tests. Quien la ejecuta contra la base de datos es el site, en tres líneas.
 * `core-ui` no habla con Payload.
 *
 * `byCategory` sin categoría **no filtra**: un bloque a medio configurar
 * enseña los últimos artículos en lugar de una sección vacía, que es lo que
 * el editor entiende como «todavía no he elegido».
 */
export function consultaDeBlog(bloque: BlogData): ConsultaDeBlog {
  const consulta: ConsultaDeBlog = { sort: ORDEN, limit: bloque.limit };

  if (bloque.source === 'featured') return { ...consulta, where: { featured: { equals: true } } };

  if (bloque.source === 'byCategory' && bloque.category) {
    return { ...consulta, where: { category: { equals: bloque.category } } };
  }

  return consulta;
}

/**
 * Convierte un artículo en la tarjeta que pinta el bloque.
 *
 * Un artículo resuelto no es más que una tarjeta con fecha, así que se mapea
 * a la forma de `card-grid` en lugar de inventar otra: la categoría va de
 * etiqueta y el resumen de subtítulo **solo si el bloque lo pide**. La tarjeta
 * del diseño de referencia no lleva párrafo, y un resumen que nadie ha pedido
 * es contenido inventado en la página.
 *
 * La fecha se formatea aquí, con el idioma de la página: dejarlo al
 * componente lo ataría a un idioma, y dejarlo al site lo sacaría de donde hay
 * tests. Si la fecha no es válida, la tarjeta se queda sin ella en vez de
 * enseñar «Invalid Date».
 */
export function articuloATarjeta(
  articulo: ArticuloResuelto,
  { locale, readMoreLabel, basePath = '/blog', showExcerpt = false }: OpcionesDeTarjeta,
): CardGridItem {
  return {
    image: articulo.image,
    title: articulo.title,
    subtitle: showExcerpt ? articulo.excerpt : undefined,
    tag: articulo.category,
    url: `${basePath}/${articulo.slug}`,
    date: fechaLegible(articulo.publishedAt, locale),
    readMoreLabel,
    variant: 'link',
  };
}

/** Fecha larga en el idioma de la página, o nada si no se puede leer. */
function fechaLegible(valor: string | undefined, locale: string): string | undefined {
  if (!valor) return undefined;

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return undefined;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}
