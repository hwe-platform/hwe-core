import { z } from 'zod';

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
  id: z.string(),
  filename: z.string(),
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
export const mediaRefSchema = z.union([z.string(), mediaSchema]);
