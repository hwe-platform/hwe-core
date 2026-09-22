import { headingFields } from './partes';

import type { Block } from 'payload';

/**
 * Blog: el primer bloque de referencia.
 *
 * No lleva contenido, lleva la consulta. Los artículos los resuelve el site
 * antes de renderizar, así que aquí no hay campo de items.
 */
export const Blog: Block = {
  slug: 'blog',
  labels: { singular: 'Blog', plural: 'Blogs' },
  fields: [
    ...headingFields,
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Párrafo de entrada entre el titular y las tarjetas.' },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'muted', 'none'],
      admin: { description: 'Fondo de la sección. Las secciones suelen alternar.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'latest',
      options: ['latest', 'featured', 'byCategory'],
      admin: { description: 'Qué artículos se muestran.' },
    },
    {
      name: 'category',
      type: 'text',
      localized: true,
      admin: { condition: (_, hermanos) => hermanos?.source === 'byCategory' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 24,
      admin: { description: 'Cuántos artículos se piden.' },
    },
    { name: 'showMoreLink', type: 'checkbox', defaultValue: false },
    {
      name: 'showMoreUrl',
      type: 'text',
      admin: { condition: (_, hermanos) => Boolean(hermanos?.showMoreLink) },
    },
    {
      name: 'showMoreLabel',
      type: 'text',
      localized: true,
      admin: { condition: (_, hermanos) => Boolean(hermanos?.showMoreLink) },
    },
  ],
};
