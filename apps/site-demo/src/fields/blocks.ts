import { iconField } from './icons';

import type { Block, Field } from 'payload';

/**
 * Bloques disponibles en un `blocks` field.
 *
 * Son los cinco que HU-005 deja utilizables; sus campos son el espejo de los
 * schemas Zod de core-ui (`pages.schema.ts`), que es la fuente de verdad. Los
 * otros diez del modelo de datos se registrarán conforme se construyan
 * (HU-009 en adelante).
 */

/** Cabecera opcional que comparten los bloques con título y subtítulo. */
const headingFields: Field[] = [
  { name: 'title', type: 'text', localized: true },
  { name: 'subtitle', type: 'text', localized: true },
];

/** Enlace con texto, destino y estilo, igual que `blockLinkSchema` en core-ui. */
const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true, localized: true },
  { name: 'url', type: 'text', required: true },
  {
    name: 'variant',
    type: 'select',
    defaultValue: 'primary',
    options: ['primary', 'secondary', 'outline', 'ghost'],
  },
];

const MediaText: Block = {
  slug: 'media-text',
  labels: { singular: 'Imagen + texto', plural: 'Imagen + texto' },
  fields: [
    ...headingFields,
    { name: 'content', type: 'richText', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'right'],
      admin: { description: 'Lado en el que se pinta la imagen respecto al texto.' },
    },
    { name: 'link', type: 'group', fields: linkFields },
  ],
};

const IconGrid: Block = {
  slug: 'icon-grid',
  labels: { singular: 'Grid de iconos', plural: 'Grids de iconos' },
  fields: [
    ...headingFields,
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

const CardGrid: Block = {
  slug: 'card-grid',
  labels: { singular: 'Grid de tarjetas', plural: 'Grids de tarjetas' },
  fields: [
    ...headingFields,
    {
      name: 'cards',
      type: 'array',
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
};

const RichText: Block = {
  slug: 'rich-text',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [{ name: 'content', type: 'richText', required: true, localized: true }],
};

const Cta: Block = {
  slug: 'cta',
  labels: { singular: 'Llamada a la acción', plural: 'Llamadas a la acción' },
  fields: [...headingFields, { name: 'links', type: 'array', required: true, fields: linkFields }],
};

/** Los bloques que el editor puede insertar hoy. */
export const contentBlocks: Block[] = [MediaText, IconGrid, CardGrid, RichText, Cta];

/** Campo `blocks` listo para usar en `pages` y en la ficha de `accommodations`. */
export const blocksField: Field = {
  name: 'blocks',
  type: 'blocks',
  blocks: contentBlocks,
  admin: { description: 'Secciones de la página, en el orden en que se pintan.' },
};
