import type { z } from 'zod';
import type { siteConfigSchema } from './site-config.schema';

/** Global `site-config`, derivado del schema Zod. */
export type SiteConfigData = z.infer<typeof siteConfigSchema>;
