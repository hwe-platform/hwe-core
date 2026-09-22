import { DOMINIOS_INCRUSTABLES, esUrlIncrustable } from '@hwe-platform/core-ui';

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

/**
 * Iconos que un enlace puede llevar a la derecha del texto.
 *
 * Lista corta a propósito, como la de la barra de servicio: un `select` con
 * el set entero invita a elegir mal. Debe coincidir con el set de la primitiva
 * `Icon`; el test de paridad no lo comprueba porque el schema lo declara como
 * texto libre, así que el componente ignora lo que no conoce.
 */
const ICONOS_DE_ENLACE = ['arrowRight', 'chevronRight', 'calendar', 'phone', 'mail'];

/** Enlace con texto, destino y estilo, igual que `blockLinkSchema` en core-ui. */
const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true, localized: true },
  { name: 'url', type: 'text', required: true },
  {
    name: 'variant',
    type: 'select',
    defaultValue: 'primary',
    options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
  },
  {
    name: 'icon',
    type: 'select',
    options: ICONOS_DE_ENLACE,
    admin: { description: 'Icono a la derecha del texto. Opcional.' },
  },
];

/**
 * Imagen + texto: el bloque que más secciones cubre del catálogo.
 *
 * Sus campos salen de comparar las siete apariciones del Figma, no de
 * imaginarlas. Lo que allí varía es el tipo de medio, el reparto de columnas,
 * la orientación y la alineación — y cada una va como su propio campo.
 */
const MediaText: Block = {
  slug: 'media-text',
  labels: { singular: 'Imagen + texto', plural: 'Imagen + texto' },
  fields: [
    ...headingFields,
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'media',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: ['image', 'embed', 'carousel'],
      admin: { description: 'Qué se pinta en la columna del medio.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, hermanos) => hermanos?.media === 'image' },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { condition: (_, hermanos) => hermanos?.media === 'carousel' },
    },
    {
      name: 'embedUrl',
      type: 'text',
      // Misma regla que el schema Zod, para que el fallo salga en el panel al
      // guardar y no en silencio al pintar.
      validate: (valor: unknown) =>
        typeof valor !== 'string' ||
        valor === '' ||
        esUrlIncrustable(valor) ||
        `Solo se puede incrustar https de: ${DOMINIOS_INCRUSTABLES.join(', ')}`,
      admin: {
        condition: (_, hermanos) => hermanos?.media === 'embed',
        description: `URL del contenido incrustado — por ejemplo, un mapa. Dominios admitidos: ${DOMINIOS_INCRUSTABLES.join(', ')}.`,
      },
    },
    {
      name: 'split',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 11,
      admin: {
        description:
          'Columnas que ocupa el medio sobre doce. 6 es mitad y mitad; el diseño de referencia usa 5, 6 y 7.',
      },
    },
    {
      name: 'reverse',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pone el medio a la derecha en lugar de a la izquierda.' },
    },
    {
      name: 'eyebrowRule',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Línea corta de acento a la izquierda del antetítulo.' },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: ['start', 'center'],
      admin: { description: 'Alineación vertical de las dos columnas.' },
    },
    {
      name: 'ratio',
      type: 'select',
      defaultValue: 'landscape',
      options: ['portrait', 'landscape', 'square'],
      admin: { description: 'Proporción del marco del medio.' },
    },
    { name: 'ctas', type: 'array', fields: linkFields },
    {
      name: 'titleAccent',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Segunda línea del titular, en color de acento. Vacío deja el titular en una línea.',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'muted', 'none'],
      admin: { description: 'Fondo de la sección. Las secciones suelen alternar.' },
    },
    {
      name: 'slotId',
      type: 'text',
      admin: {
        description:
          'Identificador para que el site inserte contenido propio en esta instancia (slot-registry.tsx). Déjalo vacío si no hay ninguno.',
      },
    },
  ],
};

const IconGrid: Block = {
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

const CardGrid: Block = {
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
