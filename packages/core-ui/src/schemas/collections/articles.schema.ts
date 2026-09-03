import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { seoSchema } from '../common.schema';

/**
 * Documento de la colección `articles`: blog / actualités.
 * `category` es texto libre localizado, no una relación a `categories`
 * (a diferencia de `accommodations` y `entities` — así lo define la spec).
 */
export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  /** Contenido richText serializado por Payload (Lexical). No se valida su estructura interna. */
  content: z.unknown(),
  image: mediaRefSchema,
  category: z.string(),
  publishedAt: z.coerce.date(),
  author: z.string().optional(),
  featured: z.boolean().default(false),
  seo: seoSchema,
});

/** Referencia a un artículo: id sin poblar o documento completo. */
export const articleRefSchema = z.union([z.string(), articleSchema]);
