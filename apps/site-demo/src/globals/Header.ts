import { headerUpdateSchema } from '@hwe-platform/core-ui';

import { publicRead, authenticatedOnly } from '../access';
import { revalidateGlobal } from '../hooks/revalidate';
import { validateGlobalWrite } from '../hooks/validate';

import type { GlobalConfig } from 'payload';

/** Enlace de navegación. La misma forma en el primer nivel y en los desplegables. */
const navLinkFields = [
  { name: 'label', type: 'text' as const, required: true, localized: true },
  { name: 'url', type: 'text' as const, required: true },
];

/**
 * Barra superior y navegación principal.
 *
 * La navegación admite dos niveles: los items de primer nivel con `children`
 * se pintan como desplegable. El orden lo controla el editor arrastrando en el
 * admin (ver docs/arquitectura/paginas-routing.md).
 */
export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: 'Configuración' },
  hooks: {
    beforeChange: [validateGlobalWrite(headerUpdateSchema, 'header')],
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'topBar',
      type: 'group',
      label: 'Barra superior',
      fields: [
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            {
              name: 'icon',
              type: 'select',
              required: true,
              // Debe coincidir con el enum de `header.schema.ts`. Lo comprueba
              // el test de paridad.
              options: ['help', 'phone', 'mail', 'video', 'user', 'custom'],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
        { name: 'showLogin', type: 'checkbox', defaultValue: false },
        { name: 'bookingButtonLabel', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      labels: { singular: 'Entrada', plural: 'Navegación' },
      fields: [
        ...navLinkFields,
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Subentrada', plural: 'Subentradas' },
          fields: navLinkFields,
        },
      ],
    },
  ],
};
