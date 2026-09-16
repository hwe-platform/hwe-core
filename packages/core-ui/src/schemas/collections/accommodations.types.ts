import type { z } from 'zod';
import type {
  accommodationSchema,
  accommodationRefSchema,
  accommodationInputSchema,
  accommodationUpdateSchema,
} from './accommodations.schema';

/** Documento de la colección `accommodations`, derivado del schema Zod. */
export type AccommodationData = z.infer<typeof accommodationSchema>;

/** Referencia a un alojamiento: id sin poblar o documento completo. */
export type AccommodationRef = z.infer<typeof accommodationRefSchema>;

/** Datos de entrada al crear un alojamiento. */
export type AccommodationInput = z.infer<typeof accommodationInputSchema>;

/** Datos de entrada al actualizar un alojamiento — todos los campos opcionales. */
export type AccommodationUpdate = z.infer<typeof accommodationUpdateSchema>;
