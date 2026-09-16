import type { ZodType } from 'zod';

/**
 * Error de validación de un boundary de escritura de Payload. Lleva las rutas
 * de los campos que fallaron para que el mensaje del admin sea accionable.
 */
export class PayloadValidationError extends Error {
  /** Rutas de los campos inválidos, en notación de puntos (`specs.capacity`). */
  readonly fields: string[];

  constructor(label: string, fields: string[], detail: string) {
    super(`[${label}] datos inválidos: ${detail}`);
    this.name = 'PayloadValidationError';
    this.fields = fields;
  }
}

/**
 * Valida los datos que entran a Payload contra su schema Zod (DEC-004: se
 * valida en cada boundary). Devuelve los datos ya parseados; si no cuadran,
 * lanza {@link PayloadValidationError} con los campos concretos que fallaron.
 *
 * Pensada para un `beforeChange`: en `update` Payload manda solo los campos
 * que cambian, así que ahí hay que pasarle el schema en su variante parcial.
 *
 * @example
 * const data = validateInput(categoryInputSchema, incoming, 'categories')
 */
export function validateInput<T>(schema: ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const fields = result.error.issues.map((issue) => issue.path.join('.') || '(raíz)');
  const detail = result.error.issues
    .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
    .join('; ');

  throw new PayloadValidationError(label, fields, detail);
}
