import { linkFields } from './partes';

import type { Block } from 'payload';

export const Gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Galería', plural: 'Galerías' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Párrafo de entrada entre el titular y la galería.' },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'muted', 'none'],
      admin: { description: 'Fondo de la sección. Las secciones suelen alternar.' },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'slider',
      options: ['slider', 'slider-thumbs', 'grid', 'masonry', 'collage'],
      admin: {
        description:
          'slider y slider-thumbs usan el carrusel; grid, masonry y collage son CSS puro.',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'alt',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description:
              'Obligatorio. Gana sobre el alt del archivo — describe la foto en el contexto de esta galería.',
          },
        },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
    {
      name: 'columns',
      type: 'number',
      defaultValue: 3,
      min: 2,
      max: 4,
      admin: {
        condition: (_, hermanos) => hermanos?.variant === 'grid' || hermanos?.variant === 'masonry',
        description: 'Columnas de la rejilla. Solo grid y masonry.',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16/9',
      options: ['16/9', '4/3', '3/2', '1/1', 'auto'],
      admin: {
        description:
          'Proporción del marco de cada imagen. auto respeta las dimensiones originales — es lo que hace masonry siempre, tenga o no este valor.',
      },
    },
    {
      name: 'lightbox',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Abre un visor a pantalla completa al hacer click en una imagen.' },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, hermanos) =>
          hermanos?.variant === 'slider' || hermanos?.variant === 'slider-thumbs',
        description: 'Avance automático. Solo slider y slider-thumbs.',
      },
    },
    {
      name: 'autoplayDelay',
      type: 'number',
      defaultValue: 3000,
      min: 1,
      admin: {
        condition: (_, hermanos) => hermanos?.autoplay === true,
        description: 'Milisegundos entre avances automáticos.',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, hermanos) =>
          hermanos?.variant === 'slider' || hermanos?.variant === 'slider-thumbs',
        description: 'Vuelve al principio al llegar al final. Solo slider y slider-thumbs.',
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, hermanos) => hermanos?.variant === 'slider',
        description: 'Puntos de paginación bajo el carrusel. Solo slider.',
      },
    },
    {
      name: 'showArrows',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, hermanos) =>
          hermanos?.variant === 'slider' || hermanos?.variant === 'slider-thumbs',
        description: 'Flechas de navegación. Solo slider y slider-thumbs.',
      },
    },
    {
      name: 'effect',
      type: 'select',
      defaultValue: 'slide',
      options: ['slide', 'fade'],
      admin: {
        condition: (_, hermanos) => hermanos?.variant === 'slider',
        description: 'Transición entre slides. Solo slider.',
      },
    },
    {
      name: 'slidesPerView',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: {
        condition: (_, hermanos) => hermanos?.variant === 'slider',
        description: 'Cuántas slides se ven a la vez. Solo slider, para el multi-slide.',
      },
    },
    {
      name: 'headingLevel',
      type: 'select',
      defaultValue: '2',
      options: ['2', '3', '4'],
      admin: { description: 'Nivel del titular en la jerarquía de la página. Nunca h1.' },
    },
    { name: 'ctas', type: 'array', fields: linkFields },
  ],
};
