import type { z } from 'zod';
import type { accommodationSchema, accommodationRefSchema } from './accommodations.schema';

/** Documento de la colección `accommodations`, derivado del schema Zod. */
export type AccommodationData = z.infer<typeof accommodationSchema>;

/** Referencia a un alojamiento: id sin poblar o documento completo. */
export type AccommodationRef = z.infer<typeof accommodationRefSchema>;
