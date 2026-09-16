import { entityInputSchema, entityUpdateSchema } from '@hwe-platform/core-ui';

import { publicContentAccess } from '../access';
import { iconField } from '../fields/icons';
import { personalizationField } from '../fields/personalization';
import { slugField } from '../fields/seo';
import { revalidateDocument } from '../hooks/revalidate';
import { slugFrom } from '../hooks/slug';
import { validateWrite } from '../hooks/validate';

import type { CollectionConfig } from 'payload';

/**
 * Colección genérica para todo lo que no es alojamiento ni página: servicios,
 * actividades, restaurante, entorno y eventos.
 *
 * Todos los tipos comparten la base y los campos específicos son opcionales,
 * en lugar de una colección por tipo. Así el editor no tiene que aprender seis
 * formularios distintos y el frontend consulta una sola colección.
 */
export const Entities: CollectionConfig = {
  slug: 'entities',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'featured', 'hasOwnPage', 'order'],
    group: 'Contenido',
  },
  hooks: {
    beforeChange: [
      slugFrom('name'),
      validateWrite({
        create: entityInputSchema,
        update: entityUpdateSchema,
        label: 'entities',
      }),
    ],
    afterChange: [revalidateDocument],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['service', 'activity', 'restaurant', 'environment', 'event', 'custom'],
    },
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('el nombre'),
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'description', type: 'richText', required: true, localized: true },
    iconField({ required: true }),
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'tag',
      type: 'text',
      localized: true,
      admin: { description: 'Etiqueta corta. Ej: "Village & port", "Sur place".' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'schedule',
      type: 'group',
      label: 'Horarios',
      fields: [
        {
          // Sin `required`: el grupo schedule es opcional (modelo-datos.md), y
          // exigir filas aquí impediría guardar una entidad sin horarios.
          name: 'periods',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            {
              name: 'icon',
              type: 'select',
              required: true,
              // Subconjunto del set general: son los tres que tienen sentido
              // junto a un horario (ver entities.schema.ts).
              options: ['utensils', 'wine', 'clock'],
            },
            { name: 'hours', type: 'text', required: true, localized: true },
          ],
        },
        { name: 'note', type: 'text', localized: true },
      ],
    },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Característica', plural: 'Características' },
      fields: [
        iconField({ required: true }),
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'detail', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      labels: { singular: 'Botón', plural: 'Botones' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
        { name: 'variant', type: 'select', required: true, options: ['primary', 'outline'] },
      ],
    },
    {
      name: 'hasOwnPage',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Si está activo, la entidad tiene URL propia.' },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    personalizationField,
  ],
};
