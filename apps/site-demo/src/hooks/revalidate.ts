import { revalidateTag } from 'next/cache';
import { revalidationTags } from '@hwe-platform/core-ui';

import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload';

/**
 * Perfil de caché con el que se invalidan los tags de contenido.
 *
 * Next 16 cambió la firma de `revalidateTag` y ahora exige un perfil además
 * del tag. `'max'` es el de mayor duración: el contenido editorial solo
 * caduca cuando el editor lo guarda, que es justo lo que dispara este hook —
 * no queremos que expire solo por tiempo.
 */
const CONTENT_CACHE_PROFILE = 'max';

/**
 * Invalida la caché ISR de un documento cuando el editor lo guarda.
 *
 * El cálculo de qué tags tocar vive en core-ui (`revalidationTags`, función
 * pura y testeada); aquí solo se hace la llamada a Next.js, que no se puede
 * ejecutar fuera de una request.
 */
export const revalidateDocument: CollectionAfterChangeHook = ({ doc, collection }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : undefined;
  for (const tag of revalidationTags({ collection: collection.slug, slug })) {
    revalidateTag(tag, CONTENT_CACHE_PROFILE);
  }
  return doc;
};

/** Misma invalidación para un global, que no tiene slug propio. */
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global }) => {
  for (const tag of revalidationTags({ collection: global.slug })) {
    revalidateTag(tag, CONTENT_CACHE_PROFILE);
  }
  return doc;
};
