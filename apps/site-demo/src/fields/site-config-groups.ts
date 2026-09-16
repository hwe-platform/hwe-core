import type { Field } from 'payload';

/** Identidad del site. `siteName` no se localiza: es el nombre propio del cliente. */
export const generalGroup: Field = {
  name: 'general',
  type: 'group',
  label: 'General',
  fields: [
    { name: 'siteName', type: 'text', required: true },
    { name: 'siteDescription', type: 'textarea', required: true, localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'logoInverted',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Versión para fondos oscuros.' },
    },
    { name: 'stars', type: 'number', admin: { description: 'Clasificación. Opcional.' } },
    { name: 'openingDates', type: 'text', required: true, localized: true },
  ],
};

/** Datos de contacto. Nada se localiza: son datos, no texto editorial. */
export const contactGroup: Field = {
  name: 'contact',
  type: 'group',
  label: 'Contacto',
  fields: [
    { name: 'address', type: 'text', required: true },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'country', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
  ],
};

/** Coordenadas y accesos, que alimentan el bloque `map`. */
export const locationGroup: Field = {
  name: 'location',
  type: 'group',
  label: 'Ubicación',
  fields: [
    { name: 'latitude', type: 'number', required: true },
    { name: 'longitude', type: 'number', required: true },
    {
      name: 'transport',
      type: 'array',
      labels: { singular: 'Acceso', plural: 'Accesos' },
      fields: [
        { name: 'icon', type: 'select', required: true, options: ['car', 'train', 'plane'] },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
};

/**
 * Idiomas del site. Debe mantenerse en sincronía con `localization.locales`
 * del payload.config — este grupo es lo que lee el middleware de Next.js para
 * decidir prefijos y dominios (ver docs/arquitectura/paginas-routing.md).
 */
export const languagesGroup: Field = {
  name: 'languages',
  type: 'group',
  label: 'Idiomas',
  fields: [
    {
      name: 'available',
      type: 'text',
      hasMany: true,
      required: true,
      admin: { description: 'Códigos de idioma: fr, en, es.' },
    },
    { name: 'default', type: 'text', required: true, defaultValue: 'fr' },
    {
      name: 'prefixDefault',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: { description: 'Si el idioma principal lleva prefijo en la URL.' },
    },
    {
      name: 'strategy',
      type: 'select',
      required: true,
      defaultValue: 'prefix',
      options: ['prefix', 'domain'],
      admin: { description: 'El Hito 1 solo implementa "prefix".' },
    },
    {
      name: 'domainMap',
      type: 'array',
      admin: { condition: (_data, siblingData) => siblingData?.strategy === 'domain' },
      fields: [
        { name: 'locale', type: 'text', required: true },
        { name: 'domain', type: 'text', required: true },
      ],
    },
  ],
};

/** Perfiles sociales. Todos opcionales: cada cliente usa los suyos. */
export const socialGroup: Field = {
  name: 'social',
  type: 'group',
  label: 'Redes sociales',
  fields: [
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
    { name: 'youtube', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'tiktok', type: 'text' },
    { name: 'instagramHandle', type: 'text', admin: { description: 'Ej: @camping_lacivelle' } },
  ],
};

/** Enlaces legales, que pinta el footer. */
export const legalGroup: Field = {
  name: 'legal',
  type: 'group',
  label: 'Legal',
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};

/** IDs de analítica. Se inyectan en el layout, no se localizan. */
export const trackingGroup: Field = {
  name: 'tracking',
  type: 'group',
  label: 'Analítica',
  fields: [
    { name: 'gtmId', type: 'text' },
    { name: 'gaId', type: 'text' },
    { name: 'metaPixelId', type: 'text' },
  ],
};

/** Snippets de terceros que se insertan tal cual en el HTML. */
export const customCodeField: Field = {
  name: 'customCode',
  type: 'array',
  labels: { singular: 'Snippet', plural: 'Código de terceros' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'code', type: 'textarea', required: true },
    {
      name: 'position',
      type: 'select',
      required: true,
      defaultValue: 'bodyEnd',
      options: ['head', 'bodyStart', 'bodyEnd'],
    },
    {
      name: 'requiresConsent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Si solo debe cargarse tras aceptar cookies.' },
    },
  ],
};

/** Motor de reservas. Los campos por motor llegan con la spec de cada uno. */
export const bookingEngineGroup: Field = {
  name: 'booking',
  type: 'group',
  label: 'Motor de reservas',
  fields: [
    {
      name: 'engine',
      type: 'select',
      required: true,
      options: ['thr', 'witbooking', 'mastercamping', 'resalys'],
    },
  ],
};
