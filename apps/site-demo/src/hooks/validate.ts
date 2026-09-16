import { validateInput } from '@hwe-platform/core-ui';

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
 * Valida en el boundary de escritura contra el schema Zod correspondiente
 * (DEC-004). Si los datos no cuadran, `validateInput` lanza un error que el
 * admin de Payload muestra con los campos concretos que fallan.
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
    validateInput(operation === 'create' ? create : update, data, label);
    return data;
  };
}

/** Misma validación para un global, que solo se actualiza. */
export function validateGlobalWrite(schema: WriteSchema, label: string): GlobalBeforeChangeHook {
  return ({ data }) => {
    validateInput(schema, data, label);
    return data;
  };
}
