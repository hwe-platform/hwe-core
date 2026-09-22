import { headingFields, linkFields } from './partes';

import type { Block } from 'payload';

export const Cta: Block = {
  slug: 'cta',
  labels: { singular: 'Llamada a la acción', plural: 'Llamadas a la acción' },
  fields: [...headingFields, { name: 'links', type: 'array', required: true, fields: linkFields }],
};
