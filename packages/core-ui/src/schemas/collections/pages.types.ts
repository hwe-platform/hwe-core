import type { z } from 'zod';
import type {
  pageSchema,
  pageBlockSchema,
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
} from './pages.schema';

/** Documento de la colección `pages`, derivado del schema Zod. */
export type PageData = z.infer<typeof pageSchema>;

/** Cualquier bloque válido dentro de `pages.blocks`. */
export type PageBlockData = z.infer<typeof pageBlockSchema>;

export type MediaTextBlockData = z.infer<typeof mediaTextBlockSchema>;
export type IconGridBlockData = z.infer<typeof iconGridBlockSchema>;
export type CardGridBlockData = z.infer<typeof cardGridBlockSchema>;
export type ReviewsGridBlockData = z.infer<typeof reviewsGridBlockSchema>;
export type ServicesGridBlockData = z.infer<typeof servicesGridBlockSchema>;
export type AccommodationsGridBlockData = z.infer<typeof accommodationsGridBlockSchema>;
export type EnvironmentGridBlockData = z.infer<typeof environmentGridBlockSchema>;
export type GalleryBlockData = z.infer<typeof galleryBlockSchema>;
export type MapBlockData = z.infer<typeof mapBlockSchema>;
export type InstagramBlockData = z.infer<typeof instagramBlockSchema>;
export type BlogBlockData = z.infer<typeof blogBlockSchema>;
export type CtaBlockData = z.infer<typeof ctaBlockSchema>;
export type FaqBlockData = z.infer<typeof faqBlockSchema>;
export type RichTextBlockData = z.infer<typeof richTextBlockSchema>;
export type EmbedBlockData = z.infer<typeof embedBlockSchema>;
