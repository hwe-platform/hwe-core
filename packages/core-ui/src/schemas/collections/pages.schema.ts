import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { seoSchema, personalizationEntrySchema } from '../common.schema';

/**
 * Schemas de bloque — stubs.
 *
 * Cada uno es un placeholder mínimo con solo `blockType`, lo justo para que
 * `pageBlockSchema` (unión discriminada) valide qué tipo de bloque es dentro
 * de `pages.blocks`. El schema completo con sus campos de contenido se define
 * cuando el bloque se construye de verdad (HU-009 en adelante), en
 * `blocks/{name}/{name}.schema.ts`, y sustituye a su stub aquí.
 */
export const mediaTextBlockSchema = z.object({ blockType: z.literal('media-text') });
export const iconGridBlockSchema = z.object({ blockType: z.literal('icon-grid') });
export const cardGridBlockSchema = z.object({ blockType: z.literal('card-grid') });
export const reviewsGridBlockSchema = z.object({ blockType: z.literal('reviews-grid') });
export const servicesGridBlockSchema = z.object({ blockType: z.literal('services-grid') });
export const accommodationsGridBlockSchema = z.object({
  blockType: z.literal('accommodations-grid'),
});
export const environmentGridBlockSchema = z.object({ blockType: z.literal('environment-grid') });
export const galleryBlockSchema = z.object({ blockType: z.literal('gallery') });
export const mapBlockSchema = z.object({ blockType: z.literal('map') });
export const instagramBlockSchema = z.object({ blockType: z.literal('instagram') });
export const blogBlockSchema = z.object({ blockType: z.literal('blog') });
export const ctaBlockSchema = z.object({ blockType: z.literal('cta') });
export const faqBlockSchema = z.object({ blockType: z.literal('faq') });
export const richTextBlockSchema = z.object({ blockType: z.literal('rich-text') });
export const embedBlockSchema = z.object({ blockType: z.literal('embed') });

/** Unión discriminada de todos los bloques disponibles en un `blocks` field. */
export const pageBlockSchema = z.discriminatedUnion('blockType', [
  mediaTextBlockSchema,
  iconGridBlockSchema,
  cardGridBlockSchema,
  reviewsGridBlockSchema,
  servicesGridBlockSchema,
  accommodationsGridBlockSchema,
  environmentGridBlockSchema,
  galleryBlockSchema,
  mapBlockSchema,
  instagramBlockSchema,
  blogBlockSchema,
  ctaBlockSchema,
  faqBlockSchema,
  richTextBlockSchema,
  embedBlockSchema,
]);

/**
 * Referencia superficial a una página, usada por `parent` para evitar la
 * auto-referencia completa de `pageSchema` (y el ciclo de tipos que eso
 * generaría en TypeScript estricto). Payload puebla relaciones self-referencing
 * a poca profundidad — esta forma es suficiente para breadcrumbs y navegación.
 */
const pageLiteRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
});

/** Documento de la colección `pages`: páginas con page builder de bloques. */
export const pageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  type: z.enum(['home', 'landing', 'static', 'listing', 'contact', 'faq']),
  parent: z.union([z.string(), pageLiteRefSchema]).optional(),

  hero: z
    .object({
      variant: z.enum(['video', 'image', 'minimal', 'none']),
      media: mediaRefSchema.optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      showBreadcrumbs: z.boolean().default(false),
    })
    .optional(),

  blocks: z.array(pageBlockSchema).default([]),

  seo: seoSchema.extend({
    noIndex: z.boolean().default(false),
    canonicalUrl: z.string().optional(),
  }),

  personalization: z.array(personalizationEntrySchema).optional(),
});
