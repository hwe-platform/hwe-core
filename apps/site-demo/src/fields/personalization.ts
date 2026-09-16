import type { Field } from 'payload';

/**
 * Variantes de contenido por segmento de visitante.
 *
 * El modelo las contempla desde el Hito 1 pero se dejan vacías hasta el
 * Hito 3 (ver specs/payload/modelo-datos.md). `segment` es texto libre
 * porque los segmentos los define cada cliente.
 */
export const personalizationField: Field = {
  name: 'personalization',
  type: 'array',
  labels: { singular: 'Variante', plural: 'Variantes' },
  admin: {
    description: 'Personalización por segmento. Se activa en el Hito 3 — déjalo vacío.',
  },
  fields: [
    { name: 'segment', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
  ],
};
