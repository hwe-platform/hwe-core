import { z } from 'zod';
import { mediaRefSchema } from './collections/media.schema';

/**
 * Metadatos SEO base. `pages` los extiende con `noIndex` y `canonicalUrl`;
 * `articles` los usa tal cual.
 */
export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: mediaRefSchema.optional(),
});

/**
 * Entrada de personalización por segmento. Misma forma en `accommodations`,
 * `entities` y `pages` — se deja vacío hasta el Hito 3 (ver modelo-datos.md).
 */
export const personalizationEntrySchema = z.object({
  segment: z.string(),
  image: mediaRefSchema,
  gallery: z.array(mediaRefSchema).optional(),
});
