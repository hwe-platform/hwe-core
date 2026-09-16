import { categoryInputSchema, categoryUpdateSchema } from '@hwe-platform/core-ui';

import { publicContentAccess } from '../access';
import { revalidateDocument } from '../hooks/revalidate';
import { slugFrom } from '../hooks/slug';
import { validateWrite } from '../hooks/validate';

import type { CollectionConfig } from 'payload';

/** Categorías con las que se agrupan alojamientos y entidades. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Contenido',
  },
  hooks: {
    beforeChange: [
      slugFrom('name'),
      validateWrite({
        create: categoryInputSchema,
        update: categoryUpdateSchema,
        label: 'categories',
      }),
    ],
    afterChange: [revalidateDocument],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      index: true,
      admin: {
        description: 'Se genera desde el nombre. Edítalo solo si necesitas otra URL.',
      },
    },
    { name: 'description', type: 'text', localized: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'De menor a mayor. Controla el orden en los listados.' },
    },
  ],
};
