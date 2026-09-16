import type { Field } from 'payload';

/** Campos SEO compartidos por `articles` y `pages` (ver common.schema.ts). */
const baseSeoFields: Field[] = [
  { name: 'metaTitle', type: 'text', localized: true },
  { name: 'metaDescription', type: 'textarea', localized: true },
  { name: 'ogImage', type: 'upload', relationTo: 'media' },
];

/**
 * Grupo SEO de una colección. `pages` lo extiende con `noIndex` y
 * `canonicalUrl`; `articles` lo usa tal cual.
 */
export function seoGroup(extraFields: Field[] = []): Field {
  return {
    name: 'seo',
    type: 'group',
    label: 'SEO',
    // El grupo siempre viaja, aunque sus campos estén vacíos: el schema Zod
    // lo declara obligatorio porque toda página y todo artículo tienen SEO.
    fields: [...baseSeoFields, ...extraFields],
  };
}

/** Campo de slug con el texto de ayuda que usan todas las colecciones. */
export function slugField(sourceLabel: string): Field {
  return {
    name: 'slug',
    type: 'text',
    localized: true,
    index: true,
    admin: {
      description: `Se genera desde ${sourceLabel}. Edítalo solo si necesitas otra URL.`,
    },
  };
}
