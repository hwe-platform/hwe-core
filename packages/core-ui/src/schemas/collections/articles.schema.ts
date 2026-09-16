import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { payloadIdSchema } from '../payload-id.schema';
import { seoSchema } from '../common.schema';

/**
 * Documento de la colección `articles`: blog / actualités.
 * `category` es texto libre localizado, no una relación a `categories`
 * (a diferencia de `accommodations` y `entities` — así lo define la spec).
 */
export const articleSchema = z.object({
  id: payloadIdSchema,
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
  /** Todos sus campos son opcionales, así que un SEO sin rellenar no viaja. */
  seo: seoSchema.optional(),
});

/** Referencia a un artículo: id sin poblar o documento completo. */
export const articleRefSchema = z.union([payloadIdSchema, articleSchema]);

/**
 * Forma de escritura de un artículo: lo que llega a un `beforeChange` de Payload
 * en un `create`. Sin `id` (Payload lo asigna) y con los campos localizados
 * ya resueltos al locale activo.
 */
export const articleInputSchema = articleSchema.omit({ id: true });

/** Forma de escritura en un `update`: Payload solo manda los campos que cambian. */
export const articleUpdateSchema = articleInputSchema.partial();
