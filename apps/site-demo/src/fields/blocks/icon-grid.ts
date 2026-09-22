import { headingFields, linkFields, iconField } from './partes';

import type { Block } from 'payload';

export const IconGrid: Block = {
  slug: 'icon-grid',
  labels: { singular: 'Grid de iconos', plural: 'Grids de iconos' },
  fields: [
    ...headingFields,
    {
      name: 'columns',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        description:
          'Cuántos caben en una fila en pantalla grande. El diseño de referencia usa 3, 5 y 6. El tamaño de los iconos y la rampa responsive se derivan de este número.',
      },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'bare',
      options: ['bare', 'card'],
      admin: { description: 'Iconos sueltos sobre el fondo, o cada uno en su tarjeta.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Párrafo de entrada entre el titular y la rejilla. Distinto del antetítulo, que va encima y es una línea corta.',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'muted', 'none'],
      admin: { description: 'Fondo de la sección. Las secciones suelen alternar.' },
    },
    { name: 'ctas', type: 'array', fields: linkFields },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        iconField(),
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'description', type: 'text', localized: true },
      ],
    },
  ],
};
