import { pageInputSchema, pageUpdateSchema } from '@hwe-platform/core-ui';

import { publicContentAccess } from '../access';
import { blocksField } from '../fields/blocks';
import { personalizationField } from '../fields/personalization';
import { seoGroup, slugField } from '../fields/seo';
import { revalidateDocument } from '../hooks/revalidate';
import { slugFrom } from '../hooks/slug';
import { validateWrite } from '../hooks/validate';

import type { CollectionConfig } from 'payload';

/**
 * Páginas con page builder. El editor monta la secuencia de bloques en el
 * orden que quiera y la URL sale del slug, sin estructura forzada por código
 * (DEC-009, ver docs/arquitectura/paginas-routing.md).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'type', 'parent'],
    group: 'Contenido',
  },
  hooks: {
    beforeChange: [
      slugFrom('title'),
      validateWrite({
        create: pageInputSchema,
        update: pageUpdateSchema,
        label: 'pages',
      }),
    ],
    afterChange: [revalidateDocument],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('el título'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'static',
      options: ['home', 'landing', 'static', 'listing', 'contact', 'faq'],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: { description: 'Página de la que cuelga esta, para los breadcrumbs.' },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'none',
          options: ['video', 'image', 'minimal', 'none'],
        },
        { name: 'media', type: 'upload', relationTo: 'media' },
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: { description: 'Sustituye al título de la página en el hero.' },
        },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'showBreadcrumbs', type: 'checkbox', defaultValue: false },
      ],
    },
    blocksField,
    seoGroup([
      { name: 'noIndex', type: 'checkbox', defaultValue: false },
      { name: 'canonicalUrl', type: 'text' },
    ]),
    personalizationField,
  ],
};
