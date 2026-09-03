import { z } from 'zod';

/** Documento de la colección `categories`: agrupa entidades y alojamientos. */
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
});

/** Referencia a una categoría: id sin poblar o documento completo. */
export const categoryRefSchema = z.union([z.string(), categorySchema]);
