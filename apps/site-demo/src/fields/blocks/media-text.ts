import { DOMINIOS_INCRUSTABLES, esUrlIncrustable } from '@hwe-platform/core-ui';
import { headingFields, linkFields } from './partes';

import type { Block } from 'payload';

/**
 * Imagen + texto: el bloque que más secciones cubre del catálogo.
 *
 * Sus campos salen de comparar las siete apariciones del Figma, no de
 * imaginarlas. Lo que allí varía es el tipo de medio, el reparto de columnas,
 * la orientación y la alineación — y cada una va como su propio campo.
 */
export const MediaText: Block = {
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
