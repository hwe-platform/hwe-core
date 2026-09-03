import type { z } from 'zod';
import type { articleSchema, articleRefSchema } from './articles.schema';

/** Documento de la colección `articles`, derivado del schema Zod. */
export type ArticleData = z.infer<typeof articleSchema>;

/** Referencia a un artículo: id sin poblar o documento completo. */
export type ArticleRef = z.infer<typeof articleRefSchema>;
