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

/**
 * Forma de escritura de una categoría: lo que llega a un `beforeChange` de Payload
 * en un `create`. Sin `id` (Payload lo asigna) y con los campos localizados
 * ya resueltos al locale activo.
 */
export const categoryInputSchema = categorySchema.omit({ id: true });

/** Forma de escritura en un `update`: Payload solo manda los campos que cambian. */
export const categoryUpdateSchema = categoryInputSchema.partial();
