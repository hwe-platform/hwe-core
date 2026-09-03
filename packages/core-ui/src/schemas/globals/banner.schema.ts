import { z } from 'zod';

/** Global `banner`: aviso global mostrado en todo el site. */
export const bannerSchema = z.object({
  enabled: z.boolean().default(false),
  message: z.string(),
  type: z.enum(['info', 'warning', 'promo']),
  dismissible: z.boolean().default(true),
  url: z.string().optional(),
});
