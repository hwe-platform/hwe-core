import { consultaDeBlog, articuloATarjeta } from '@hwe-platform/core-ui';

import type { ArticuloResuelto, BlockInstance, BlogData } from '@hwe-platform/core-ui';
import type { Payload } from 'payload';

/**
 * Rótulo del enlace de cada tarjeta de artículo.
 *
 * No es contenido y no sale de Payload: es interfaz, y va en el idioma del
 * cliente. Escrito a mano acabaría en el idioma de la conversación, que es
 * lo que ya pasó con el pie.
 */
const ROTULOS = { leerArticulo: "Lire l'article" };

/**
 * Rellena los bloques de referencia antes de renderizar.
 *
 * Un bloque de referencia no lleva su contenido, lleva la consulta: el editor
 * dice qué quiere y aquí se le busca. Esta es **la capa fina**: lo que puede
 * equivocarse —qué filtro lleva cada fuente, cómo se mapea un artículo a una
 * tarjeta, cómo se formatea la fecha— vive en `core-ui` con tests, y aquí solo
 * queda ejecutar la consulta contra la base de datos.
 *
 * Si la consulta falla, el bloque se queda sin artículos y el componente no
 * pinta la sección. Una página no se cae porque un listado no responda.
 */
export async function resolverBloques(
  payload: Payload,
  bloques: BlockInstance[],
  locale: string,
): Promise<BlockInstance[]> {
  return Promise.all(bloques.map((bloque) => resolverBloque(payload, bloque, locale)));
}

async function resolverBloque(
  payload: Payload,
  bloque: BlockInstance,
  locale: string,
): Promise<BlockInstance> {
  if (bloque.blockType !== 'blog') return bloque;

  const { sort, limit, where } = consultaDeBlog(bloque as unknown as BlogData);

  try {
    const { docs } = await payload.find({
      collection: 'articles',
      sort,
      limit,
      where,
      locale: locale as 'fr',
      depth: 1,
    });

    const items = (docs as unknown as ArticuloResuelto[]).map((articulo) =>
      articuloATarjeta(articulo, { locale, readMoreLabel: ROTULOS.leerArticulo }),
    );

    return { ...bloque, items };
  } catch {
    return { ...bloque, items: [] };
  }
}
