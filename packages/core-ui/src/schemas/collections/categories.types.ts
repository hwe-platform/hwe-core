import type { z } from 'zod';
import type { categorySchema, categoryRefSchema } from './categories.schema';

/** Documento de la colección `categories`, derivado del schema Zod. */
export type CategoryData = z.infer<typeof categorySchema>;

/** Referencia a una categoría: id sin poblar o documento completo. */
export type CategoryRef = z.infer<typeof categoryRefSchema>;
