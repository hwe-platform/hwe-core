import { z } from 'zod';

/** Global `banner`: aviso global mostrado en todo el site. */
export const bannerSchema = z.object({
  enabled: z.boolean().default(false),
  message: z.string(),
  type: z.enum(['info', 'warning', 'promo']),
  dismissible: z.boolean().default(true),
  url: z.string().optional(),
});

/**
 * Forma de escritura de `banner`. Los globals no tienen `id`, así que la
 * entrada coincide con el documento; Payload solo manda los campos que
 * cambian, de ahí la variante parcial.
 */
export const bannerInputSchema = bannerSchema;

/** Forma de escritura en un `update` del global. */
export const bannerUpdateSchema = bannerSchema.partial();
