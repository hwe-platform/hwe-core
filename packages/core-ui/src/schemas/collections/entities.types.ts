import type { z } from 'zod';
import type { entitySchema, entityRefSchema } from './entities.schema';

/** Documento de la colección `entities`, derivado del schema Zod. */
export type EntityData = z.infer<typeof entitySchema>;

/** Referencia a una entidad: id sin poblar o documento completo. */
export type EntityRef = z.infer<typeof entityRefSchema>;
