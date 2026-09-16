import { accommodationInputSchema, accommodationUpdateSchema } from '@hwe-platform/core-ui';

import { publicContentAccess } from '../access';
import {
  bedroomDetailsField,
  bookingGroup,
  documentsField,
  equipmentField,
  featuresField,
  mediaGroup,
  pricingGroup,
  specsGroup,
} from '../fields/accommodation-groups';
import { blocksField } from '../fields/blocks';
import { personalizationField } from '../fields/personalization';
import { slugField } from '../fields/seo';
import { revalidateDocument } from '../hooks/revalidate';
import { slugFrom } from '../hooks/slug';
import { validateWrite } from '../hooks/validate';

import type { CollectionConfig } from 'payload';

/**
 * Alojamientos del cliente: emplacements, mobil-homes, cottages.
 *
 * Alimenta las tarjetas de los listados, la ficha completa y la conexión con
 * el motor de reservas. Los campos de dominio camping (`type`, `petFriendly`)
 * son los que hay que revisar antes de extraer esta colección a core-ui —
 * ver el TODO de Hito 5 en el README de esta carpeta.
 */
export const Accommodations: CollectionConfig = {
  slug: 'accommodations',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'category', 'featured', 'order'],
    group: 'Contenido',
  },
  hooks: {
    beforeChange: [
      slugFrom('name'),
      validateWrite({
        create: accommodationInputSchema,
        update: accommodationUpdateSchema,
        label: 'accommodations',
      }),
    ],
    afterChange: [revalidateDocument],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('el nombre'),
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['emplacement', 'mobilhome', 'cottage', 'chalet', 'tente'],
    },
    {
      name: 'subtype',
      type: 'text',
      localized: true,
      admin: { description: 'Ej: "Cyclo Rando", "Premium".' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Resumen para las tarjetas de listado.' },
    },
    { name: 'description', type: 'richText', localized: true },

    specsGroup,
    bedroomDetailsField,
    equipmentField,
    pricingGroup,
    mediaGroup,
    documentsField,
    featuresField,

    {
      name: 'comparison',
      type: 'relationship',
      relationTo: 'accommodations',
      hasMany: true,
      admin: {
        description: 'Si lo dejas vacío, el site propone otros de la misma categoría.',
      },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },

    bookingGroup,
    personalizationField,
    blocksField,
  ],
};
