import type { z } from 'zod';
import type {
  mediaSchema,
  mediaRefSchema,
  mediaInputSchema,
  mediaUpdateSchema,
} from './media.schema';

/** Documento de la colección `media`, derivado del schema Zod. */
export type MediaData = z.infer<typeof mediaSchema>;

/** Referencia a media: id sin poblar o documento completo. */
export type MediaRef = z.infer<typeof mediaRefSchema>;

/** Datos de entrada al crear un archivo de `media`. */
export type MediaInput = z.infer<typeof mediaInputSchema>;

/** Datos de entrada al actualizar un archivo de `media` — todos los campos opcionales. */
export type MediaUpdate = z.infer<typeof mediaUpdateSchema>;
