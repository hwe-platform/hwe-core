import { articleInputSchema, articleUpdateSchema } from '@hwe-platform/core-ui';

import { publicContentAccess } from '../access';
import { seoGroup, slugField } from '../fields/seo';
import { revalidateDocument } from '../hooks/revalidate';
import { slugFrom } from '../hooks/slug';
import { validateWrite } from '../hooks/validate';

import type { CollectionConfig } from 'payload';

/**
 * Blog / actualités. Colección propia porque tiene ciclo de vida propio
 * (fecha de publicación, autor) y el editor entra a ella directamente.
 *
 * `category` es texto libre localizado, no una relación a `categories` —
 * así lo define specs/payload/modelo-datos.md.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'featured'],
    group: 'Contenido',
  },
  hooks: {
    beforeChange: [
      slugFrom('title'),
      validateWrite({
        create: articleInputSchema,
        update: articleUpdateSchema,
        label: 'articles',
      }),
    ],
    afterChange: [revalidateDocument],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('el título'),
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Resumen corto para las tarjetas del listado.' },
    },
    { name: 'content', type: 'richText', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'category', type: 'text', required: true, localized: true },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'author', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    seoGroup(),
  ],
};
