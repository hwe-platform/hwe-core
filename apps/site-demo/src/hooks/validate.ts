import { APIError } from 'payload';
import { validateInput, normalizeWriteData, PayloadValidationError } from '@hwe-platform/core-ui';

import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload';
import type { WriteSchema } from '@hwe-platform/core-ui';

/** Schemas de escritura de una colección, uno por operación de Payload. */
export type WriteSchemas = {
  /** Forma completa: en `create` llegan todos los campos. */
  create: WriteSchema;
  /** Forma parcial: en `update` Payload solo manda lo que cambia. */
  update: WriteSchema;
  /** Nombre de la colección, para que el error diga de dónde viene. */
  label: string;
};

/**
 * Valida contra el schema y traduce el fallo a un error que Payload entiende.
 *
 * Sin esto, un `Error` normal sale del admin como un 500 con "Something went
 * wrong": el editor no sabe qué campo corregir. `APIError` con status 400
 * hace que el mensaje —con las rutas de los campos que fallan— llegue tal cual.
 *
 * Los datos se normalizan antes: el admin manda `null` para los opcionales
 * vacíos y `{}` para los group sin rellenar, y ninguna de las dos formas pasa
 * un schema escrito contra el documento que se lee.
 */
function validarOFallar(schema: WriteSchema, data: unknown, label: string): void {
  try {
    validateInput(schema, normalizeWriteData(data), label);
  } catch (error) {
    if (error instanceof PayloadValidationError) {
      throw new APIError(error.message, 400, { fields: error.fields }, true);
    }
    throw error;
  }
}

/**
 * Valida en el boundary de escritura contra el schema Zod correspondiente
 * (DEC-004).
 *
 * Devuelve `data` sin tocar, no lo parseado: Payload espera recibir sus
 * propios datos, y Zod descartaría las claves internas que el schema no
 * declara.
 *
 * @example
 * hooks: { beforeChange: [validateWrite({ create: x, update: y, label: 'pages' })] }
 */
export function validateWrite({ create, update, label }: WriteSchemas): CollectionBeforeChangeHook {
  return ({ data, operation }) => {
    validarOFallar(operation === 'create' ? create : update, data, label);
    return data;
  };
}

/** Misma validación para un global, que solo se actualiza. */
export function validateGlobalWrite(schema: WriteSchema, label: string): GlobalBeforeChangeHook {
  return ({ data }) => {
    validarOFallar(schema, data, label);
    return data;
  };
}
