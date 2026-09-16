import type { z } from 'zod';
import type { headerSchema, headerInputSchema, headerUpdateSchema } from './header.schema';

/** Global `header`, derivado del schema Zod. */
export type HeaderData = z.infer<typeof headerSchema>;

/** Datos de entrada al guardar `header`. */
export type HeaderInput = z.infer<typeof headerInputSchema>;

/** Datos de entrada al actualizar `header` — todos los campos opcionales. */
export type HeaderUpdate = z.infer<typeof headerUpdateSchema>;
