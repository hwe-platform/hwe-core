import { bannerUpdateSchema } from '@hwe-platform/core-ui';

import { publicRead, authenticatedOnly } from '../access';
import { revalidateGlobal } from '../hooks/revalidate';
import { validateGlobalWrite } from '../hooks/validate';

import type { GlobalConfig } from 'payload';

/** Aviso global que se muestra en todo el site. */
export const Banner: GlobalConfig = {
  slug: 'banner',
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: 'Configuración' },
  hooks: {
    beforeChange: [validateGlobalWrite(bannerUpdateSchema, 'banner')],
    afterChange: [revalidateGlobal],
  },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'message', type: 'text', required: true, localized: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: ['info', 'warning', 'promo'],
    },
    { name: 'dismissible', type: 'checkbox', defaultValue: true },
    { name: 'url', type: 'text', admin: { description: 'Destino al pulsar el aviso.' } },
  ],
};
