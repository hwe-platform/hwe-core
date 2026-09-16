import { siteConfigUpdateSchema } from '@hwe-platform/core-ui';

import { publicRead, authenticatedOnly } from '../access';
import {
  bookingEngineGroup,
  contactGroup,
  customCodeField,
  generalGroup,
  languagesGroup,
  legalGroup,
  locationGroup,
  socialGroup,
  trackingGroup,
} from '../fields/site-config-groups';
import { revalidateGlobal } from '../hooks/revalidate';
import { validateGlobalWrite } from '../hooks/validate';

import type { GlobalConfig } from 'payload';

/**
 * Configuración general del site: lo que no cambia de una página a otra.
 *
 * Es la fuente única de las redes sociales, los métodos de pago y los enlaces
 * legales — el footer los lee de aquí en vez de duplicarlos.
 */
export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configuración del site',
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: 'Configuración' },
  hooks: {
    beforeChange: [validateGlobalWrite(siteConfigUpdateSchema, 'site-config')],
    afterChange: [revalidateGlobal],
  },
  fields: [
    generalGroup,
    contactGroup,
    locationGroup,
    languagesGroup,
    socialGroup,
    {
      name: 'payments',
      type: 'text',
      hasMany: true,
      admin: { description: 'Métodos de pago aceptados. Ej: CB, Visa, Mastercard.' },
    },
    legalGroup,
    trackingGroup,
    customCodeField,
    bookingEngineGroup,
  ],
};
