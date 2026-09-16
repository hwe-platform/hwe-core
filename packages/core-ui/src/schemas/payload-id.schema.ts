import { z } from 'zod';

/**
 * ID de un documento de Payload.
 *
 * El adapter de Postgres usa columnas `serial`, así que los ids son números,
 * no las cadenas de MongoDB. Se acepta también `string` porque un cliente que
 * monte Payload sobre Mongo los recibiría así, y porque las relaciones sin
 * poblar viajan como cadena en algunos payloads del admin.
 *
 * Vive en su propio módulo, sin importar nada del paquete, a propósito: lo
 * necesitan tanto `common.schema` como las colecciones, y `common.schema` ya
 * importa de `collections/media.schema`. Declararlo en cualquiera de los dos
 * cerraría un ciclo de imports que TypeScript no detecta y que revienta en
 * runtime con "Cannot access before initialization".
 */
export const payloadIdSchema = z.union([z.string(), z.number()]);

/** ID de un documento de Payload, derivado del schema. */
export type PayloadId = z.infer<typeof payloadIdSchema>;
