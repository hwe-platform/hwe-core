import type { z } from 'zod';
import type { bannerSchema, bannerInputSchema, bannerUpdateSchema } from './banner.schema';

/** Global `banner`, derivado del schema Zod. */
export type BannerData = z.infer<typeof bannerSchema>;

/** Datos de entrada al guardar `banner`. */
export type BannerInput = z.infer<typeof bannerInputSchema>;

/** Datos de entrada al actualizar `banner` — todos los campos opcionales. */
export type BannerUpdate = z.infer<typeof bannerUpdateSchema>;
