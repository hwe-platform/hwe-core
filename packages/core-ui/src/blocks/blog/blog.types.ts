import type { z } from 'zod';
import type { blogBlockSchema } from './blog.schema';
import type { MediaRef } from '../../schemas/collections/media.types';

/** Datos del bloque, derivados del schema Zod (DEC-004). */
export type BlogData = z.infer<typeof blogBlockSchema>;

/**
 * Consulta que el site ejecuta contra la colección `articles`.
 *
 * Es la forma que espera `payload.find`, recortada a lo que el bloque decide.
 * El tipo vive aquí y no en el site para que la función pura que la construye
 * tenga con qué contrastarse.
 */
export type ConsultaDeBlog = {
  sort: string;
  limit: number;
  where?: Record<string, { equals: string | boolean }>;
};

/** Un artículo tal como llega de la colección, con lo que la tarjeta usa. */
export type ArticuloResuelto = {
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  image: MediaRef;
};

/** Lo que el site aporta y el artículo no trae. */
export type OpcionesDeTarjeta = {
  /** Idioma de la página, para formatear la fecha. */
  locale: string;
  /** Texto del enlace de cada tarjeta. En el diseño, «Lire l'article». */
  readMoreLabel?: string;
  /** Prefijo de la URL del artículo. Por defecto `/blog`. */
  basePath?: string;
  /** Si la tarjeta lleva el resumen bajo el titular. Lo dice el bloque. */
  showExcerpt?: boolean;
};
