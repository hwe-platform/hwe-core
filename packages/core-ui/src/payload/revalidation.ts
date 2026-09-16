/** Tag de caché que agrupa todo lo que depende de los globals del site. */
export const SITE_GLOBAL_TAG = 'site-global';

/** Datos mínimos de un documento para calcular sus tags de caché. */
export type RevalidationTarget = {
  /** Slug de la colección en Payload (`pages`, `accommodations`, ...). */
  collection: string;
  /** Slug del documento, si lo tiene. Los globals no tienen. */
  slug?: string | null;
};

/**
 * Calcula los tags de caché que hay que invalidar cuando cambia un documento
 * (ver docs/arquitectura/paginas-routing.md, sección ISR).
 *
 * Es una función pura para poder testearla sin Next.js: la llamada real a
 * `revalidateTag` la hace el `afterChange` de site-demo con lo que devuelve.
 *
 * @example
 * revalidationTags({ collection: 'pages', slug: 'le-camping' })
 * // ['pages', 'pages-le-camping', 'site-global']
 */
export function revalidationTags({ collection, slug }: RevalidationTarget): string[] {
  const tags = [collection];
  if (slug) tags.push(`${collection}-${slug}`);
  tags.push(SITE_GLOBAL_TAG);
  return tags;
}
