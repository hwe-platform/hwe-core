import { iconField } from './icons';

import type { Field } from 'payload';

/** Ficha técnica del alojamiento. Nada de esto se localiza: son datos, no texto. */
export const specsGroup: Field = {
  name: 'specs',
  type: 'group',
  label: 'Ficha técnica',
  fields: [
    { name: 'capacity', type: 'number', required: true, admin: { description: 'Personas.' } },
    { name: 'bedrooms', type: 'number', required: true },
    { name: 'surface', type: 'number', required: true, admin: { description: 'En m².' } },
    { name: 'hasAC', type: 'checkbox', defaultValue: false, label: 'Aire acondicionado' },
    { name: 'petFriendly', type: 'checkbox', defaultValue: false, label: 'Admite mascotas' },
  ],
};

/** Precio de referencia. La moneda y el importe no se localizan; la nota sí. */
export const pricingGroup: Field = {
  name: 'pricing',
  type: 'group',
  label: 'Precio',
  fields: [
    { name: 'from', type: 'number', admin: { description: 'Precio "desde". Opcional.' } },
    { name: 'currency', type: 'text', defaultValue: 'EUR' },
    {
      name: 'priceNote',
      type: 'text',
      localized: true,
      admin: { description: 'Ej: "par nuit", "par semaine".' },
    },
  ],
};

/** Imágenes y vídeo del alojamiento. */
export const mediaGroup: Field = {
  name: 'media',
  type: 'group',
  label: 'Imágenes',
  fields: [
    { name: 'mainImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'floorPlan', type: 'upload', relationTo: 'media' },
    { name: 'video', type: 'text', admin: { description: 'URL del vídeo. Opcional.' } },
  ],
};

/** Conexión con el motor de reservas. */
export const bookingGroup: Field = {
  name: 'booking',
  type: 'group',
  label: 'Reservas',
  fields: [
    {
      name: 'externalId',
      type: 'text',
      admin: { description: 'ID del alojamiento en el motor de reservas.' },
    },
    { name: 'bookable', type: 'checkbox', defaultValue: false },
  ],
};

/** Equipamiento incluido, con icono del set de core-ui. */
export const equipmentField: Field = {
  name: 'equipment',
  type: 'array',
  labels: { singular: 'Equipamiento', plural: 'Equipamiento' },
  fields: [
    { name: 'label', type: 'text', required: true, localized: true },
    iconField(),
    { name: 'included', type: 'checkbox', defaultValue: true },
  ],
};

/** Highlights cortos que se pintan como badges en la ficha. */
export const featuresField: Field = {
  name: 'features',
  type: 'array',
  labels: { singular: 'Destacado', plural: 'Destacados' },
  fields: [iconField(), { name: 'label', type: 'text', required: true, localized: true }],
};

/** Descripción de cada dormitorio, una línea por habitación. */
export const bedroomDetailsField: Field = {
  name: 'bedroomDetails',
  type: 'array',
  labels: { singular: 'Dormitorio', plural: 'Dormitorios' },
  fields: [{ name: 'description', type: 'text', required: true, localized: true }],
};

/** Documentos descargables (fichas técnicas, planos en PDF). */
export const documentsField: Field = {
  name: 'documents',
  type: 'array',
  labels: { singular: 'Documento', plural: 'Documentos' },
  fields: [
    { name: 'label', type: 'text', required: true, localized: true },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
  ],
};
