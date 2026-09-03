import type { z } from 'zod';
import type { mediaSchema, mediaRefSchema } from './media.schema';

/** Documento de la colección `media`, derivado del schema Zod. */
export type MediaData = z.infer<typeof mediaSchema>;

/** Referencia a media: id sin poblar o documento completo. */
export type MediaRef = z.infer<typeof mediaRefSchema>;
