import { headingFields, linkFields } from './partes';

import type { Block } from 'payload';

export const CardGrid: Block = {
  slug: 'card-grid',
  labels: { singular: 'Grid de tarjetas', plural: 'Grids de tarjetas' },
  fields: [
    ...headingFields,
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Párrafo de entrada entre el titular y la rejilla.' },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'muted', 'none'],
      admin: { description: 'Fondo de la sección. Las secciones suelen alternar.' },
    },
    {
      name: 'card',
      type: 'select',
      required: true,
      defaultValue: 'stacked',
      options: ['overlay', 'stacked'],
      admin: { description: 'Texto sobre la imagen, o imagen arriba y texto debajo.' },
    },
    {
      name: 'columns',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      admin: { description: 'Cuántas tarjetas caben en una fila. El diseño usa 3 y 4.' },
    },
    {
      name: 'spans',
      type: 'number',
      hasMany: true,
      admin: {
        description:
          'Reparto asimétrico en columnas de doce, una por tarjeta y en ciclo. Vacío deja la rejilla uniforme. El diseño usa 5 y 7 en «Nos Hébergements».',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: ['manual', 'accommodations', 'entities', 'articles'],
      admin: {
        description:
          'De dónde salen las tarjetas. Hoy solo se pintan las manuales; la resolución de colecciones llega con el resolver del site.',
      },
    },
    {
      name: 'sourceConfig',
      type: 'group',
      admin: { condition: (_, hermanos) => hermanos?.source !== 'manual' },
      fields: [
        { name: 'category', type: 'text' },
        { name: 'limit', type: 'number', min: 1 },
        { name: 'featured', type: 'checkbox' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      admin: { condition: (_, hermanos) => hermanos?.source === 'manual' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'tag', type: 'text', localized: true },
        { name: 'url', type: 'text' },
        { name: 'date', type: 'text' },
        { name: 'readMoreLabel', type: 'text', localized: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'link',
          options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
          admin: { description: 'Botón relleno o enlace suelto, como en el diseño.' },
        },
      ],
    },
    { name: 'ctas', type: 'array', fields: linkFields },
  ],
};
