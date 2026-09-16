import type { z } from 'zod';
import type {
  siteConfigSchema,
  siteConfigInputSchema,
  siteConfigUpdateSchema,
} from './site-config.schema';

/** Global `site-config`, derivado del schema Zod. */
export type SiteConfigData = z.infer<typeof siteConfigSchema>;

/** Datos de entrada al guardar `site-config`. */
export type SiteConfigInput = z.infer<typeof siteConfigInputSchema>;

/** Datos de entrada al actualizar `site-config` — todos los campos opcionales. */
export type SiteConfigUpdate = z.infer<typeof siteConfigUpdateSchema>;
