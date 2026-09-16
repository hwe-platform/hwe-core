import { resolveSlug } from '@hwe-platform/core-ui';

import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Genera el slug desde el campo de título cuando el editor no ha escrito uno,
 * y normaliza el que haya escrito.
 *
 * Es `beforeChange` y no `beforeValidate` porque el slug es obligatorio: si se
 * generase después de validar, un documento sin slug manual sería rechazado
 * antes de que el hook llegue a rellenarlo.
 *
 * La lógica vive en core-ui (`resolveSlug`, función pura y testeada); aquí
 * solo se enchufa al ciclo de vida de Payload.
 *
 * @example
 * hooks: { beforeChange: [slugFrom('title')] }
 */
export function slugFrom(sourceField: string): CollectionBeforeChangeHook {
  return ({ data }) => {
    const current = typeof data.slug === 'string' ? data.slug : undefined;
    const source = typeof data[sourceField] === 'string' ? data[sourceField] : undefined;

    const slug = resolveSlug({ current, source });
    if (slug) data.slug = slug;

    return data;
  };
}
