/**
 * El schema de `icon-grid` vive con el resto de bloques en `pages.schema.ts`,
 * que es donde está la unión discriminada que Payload valida. Aquí se reexporta
 * para poder importar el bloque entero desde `blocks/icon-grid`.
 */
export { iconGridBlockSchema } from '../../schemas/collections/pages.schema';
