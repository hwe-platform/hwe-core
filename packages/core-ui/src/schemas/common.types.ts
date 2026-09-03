import type { z } from 'zod';
import type { seoSchema, personalizationEntrySchema } from './common.schema';

/** Metadatos SEO base, derivados del schema Zod. */
export type SeoData = z.infer<typeof seoSchema>;

/** Entrada de personalización por segmento, derivada del schema Zod. */
export type PersonalizationEntryData = z.infer<typeof personalizationEntrySchema>;
