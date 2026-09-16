import type { z } from 'zod';
import type {
  categorySchema,
  categoryRefSchema,
  categoryInputSchema,
  categoryUpdateSchema,
} from './categories.schema';

/** Documento de la colección `categories`, derivado del schema Zod. */
export type CategoryData = z.infer<typeof categorySchema>;

/** Referencia a una categoría: id sin poblar o documento completo. */
export type CategoryRef = z.infer<typeof categoryRefSchema>;

/** Datos de entrada al crear una categoría. */
export type CategoryInput = z.infer<typeof categoryInputSchema>;

/** Datos de entrada al actualizar una categoría — todos los campos opcionales. */
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
