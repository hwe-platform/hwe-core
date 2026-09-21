/**
 * El schema del hero vive en `pages.schema.ts`, junto al resto del documento,
 * porque **no es un bloque**: es un grupo de campos de `pages`. Aquí solo se
 * reexporta para que el bloque se importe entero desde `blocks/hero`.
 *
 * Redefinirlo sería el error que HU-005 ya pagó: dos declaraciones del mismo
 * dato que se separan sin que nadie lo note, porque el test de paridad compara
 * el primer nivel y este grupo está más abajo.
 */
export { heroSchema } from '../../schemas/collections/pages.schema';
