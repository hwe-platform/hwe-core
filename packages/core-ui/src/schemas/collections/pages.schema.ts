import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { seoSchema, personalizationEntrySchema } from '../common.schema';

/**
 * Schemas de bloque.
 *
 * Los cinco que el editor ya puede usar (HU-005) tienen sus campos definidos
 * aquí. El resto siguen siendo placeholders con solo `blockType`, lo justo
 * para que `pageBlockSchema` valide de qué tipo es el bloque; su schema
 * completo llega cuando el bloque se construye de verdad (HU-009 en adelante).
 */

/** Enlace con texto, destino y estilo de botón. Compartido por varios bloques. */
export const blockLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
});

/** Cabecera opcional que comparten los bloques con título y subtítulo. */
const blockHeadingSchema = {
  title: z.string().optional(),
  subtitle: z.string().optional(),
};

/** Imagen + texto en dos columnas. */
export const mediaTextBlockSchema = z.object({
  blockType: z.literal('media-text'),
  ...blockHeadingSchema,
  /** Contenido richText serializado por Payload (Lexical). */
  content: z.unknown(),
  image: mediaRefSchema,
  /** Lado en el que se pinta la imagen respecto al texto. */
  imagePosition: z.enum(['left', 'right']).default('left'),
  link: blockLinkSchema.optional(),
});

/** Grid de iconos con label, para listar servicios o características. */
export const iconGridBlockSchema = z.object({
  blockType: z.literal('icon-grid'),
  ...blockHeadingSchema,
  items: z.array(
    z.object({
      icon: z.string(),
      label: z.string(),
      description: z.string().optional(),
    }),
  ),
});

/** Grid de tarjetas con imagen. */
export const cardGridBlockSchema = z.object({
  blockType: z.literal('card-grid'),
  ...blockHeadingSchema,
  cards: z.array(
    z.object({
      image: mediaRefSchema,
      title: z.string(),
      description: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
});

/** Texto libre. */
export const richTextBlockSchema = z.object({
  blockType: z.literal('rich-text'),
  /** Contenido richText serializado por Payload (Lexical). */
  content: z.unknown(),
});

/** Llamada a la acción con uno o varios botones. */
export const ctaBlockSchema = z.object({
  blockType: z.literal('cta'),
  ...blockHeadingSchema,
  links: z.array(blockLinkSchema),
});

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
export const faqBlockSchema = z.object({ blockType: z.literal('faq') });
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

/**
 * Forma de escritura de una página: lo que llega a un `beforeChange` de Payload
 * en un `create`. Sin `id` (Payload lo asigna) y con los campos localizados
 * ya resueltos al locale activo.
 */
export const pageInputSchema = pageSchema.omit({ id: true });

/** Forma de escritura en un `update`: Payload solo manda los campos que cambian. */
export const pageUpdateSchema = pageInputSchema.partial();
