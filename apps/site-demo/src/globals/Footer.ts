import { footerUpdateSchema } from '@hwe-platform/core-ui';

import { publicRead, authenticatedOnly } from '../access';
import { revalidateGlobal } from '../hooks/revalidate';
import { validateGlobalWrite } from '../hooks/validate';

import type { GlobalConfig } from 'payload';

/**
 * Contenido del footer.
 *
 * Redes sociales, métodos de pago y enlaces legales NO están aquí: se leen de
 * `site-config` para no duplicarlos (specs/payload/modelo-datos.md).
 *
 * Las columnas son polimórficas — `type` decide qué campo se rellena. La
 * condición está en `admin.condition` para que el editor solo vea el campo que
 * le toca; la coherencia de los datos la garantiza el schema Zod al validar.
 */
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: 'Configuración' },
  hooks: {
    beforeChange: [validateGlobalWrite(footerUpdateSchema, 'footer')],
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'virtualAssistant',
      type: 'group',
      label: 'Asistente virtual',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'title', type: 'text', localized: true },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'placeholder', type: 'text', localized: true },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Columna', plural: 'Columnas' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'links',
          options: ['links', 'text', 'schedule', 'newsletter'],
        },
        {
          name: 'links',
          type: 'array',
          admin: { condition: (_data, siblingData) => siblingData?.type === 'links' },
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
          admin: { condition: (_data, siblingData) => siblingData?.type === 'text' },
        },
        {
          name: 'newsletter',
          type: 'group',
          admin: { condition: (_data, siblingData) => siblingData?.type === 'newsletter' },
          fields: [
            { name: 'description', type: 'text', localized: true },
            { name: 'buttonLabel', type: 'text', required: true, localized: true },
            {
              name: 'provider',
              type: 'select',
              required: true,
              options: ['mailchimp', 'sendinblue', 'custom'],
            },
            { name: 'actionUrl', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'partners',
      type: 'array',
      labels: { singular: 'Partner', plural: 'Partners' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'copyright', type: 'text', required: true, localized: true },
  ],
};
