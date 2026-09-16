import type { z } from 'zod';
import type {
  articleSchema,
  articleRefSchema,
  articleInputSchema,
  articleUpdateSchema,
} from './articles.schema';

/** Documento de la colección `articles`, derivado del schema Zod. */
export type ArticleData = z.infer<typeof articleSchema>;

/** Referencia a un artículo: id sin poblar o documento completo. */
export type ArticleRef = z.infer<typeof articleRefSchema>;

/** Datos de entrada al crear un artículo. */
export type ArticleInput = z.infer<typeof articleInputSchema>;

/** Datos de entrada al actualizar un artículo — todos los campos opcionales. */
export type ArticleUpdate = z.infer<typeof articleUpdateSchema>;
