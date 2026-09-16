import type { z } from 'zod';
import type { footerSchema, footerInputSchema, footerUpdateSchema } from './footer.schema';

/** Global `footer`, derivado del schema Zod. */
export type FooterData = z.infer<typeof footerSchema>;

/** Datos de entrada al guardar `footer`. */
export type FooterInput = z.infer<typeof footerInputSchema>;

/** Datos de entrada al actualizar `footer` — todos los campos opcionales. */
export type FooterUpdate = z.infer<typeof footerUpdateSchema>;
