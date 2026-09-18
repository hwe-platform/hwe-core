import { z } from 'zod';
import { payloadIdSchema } from '../payload-id.schema';

/** Variante de tamaño generada automáticamente por Payload para una imagen. */
const mediaSizeSchema = z.object({
  url: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

/**
 * Documento de la colección `media`: imágenes, vídeos y documentos.
 * Payload gestiona el upload, el almacenamiento y los tamaños automáticamente.
 */
export const mediaSchema = z.object({
  id: payloadIdSchema,
  filename: z.string(),
  /**
   * URL pública del archivo. La construye Payload al leer, a partir del
   * adapter de almacenamiento — por eso cambiar de proveedor no obliga a
   * migrar la base de datos (DEC-010).
   *
   * Opcional porque una consulta con `depth: 0` no la devuelve.
   */
  url: z.string().optional(),
  alt: z.string(),
  caption: z.string().optional(),
  mimeType: z.string(),
  filesize: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  sizes: z
    .object({
      thumbnail: mediaSizeSchema.optional(),
      card: mediaSizeSchema.optional(),
      hero: mediaSizeSchema.optional(),
      og: mediaSizeSchema.optional(),
    })
    .optional(),
});

/**
 * Referencia a un documento de `media` en un campo de relación/upload:
 * el id sin poblar, o el documento completo cuando Payload lo popula.
 */
export const mediaRefSchema = z.union([payloadIdSchema, mediaSchema]);

/**
 * Forma de escritura de un archivo de `media`: lo que llega a un `beforeChange` de Payload
 * en un `create`. Sin `id` (Payload lo asigna) y con los campos localizados
 * ya resueltos al locale activo.
 */
export const mediaInputSchema = mediaSchema.omit({ id: true });

/** Forma de escritura en un `update`: Payload solo manda los campos que cambian. */
export const mediaUpdateSchema = mediaInputSchema.partial();
