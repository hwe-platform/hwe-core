/**
 * El schema de `media-text` vive con el resto de bloques en `pages.schema.ts`,
 * que es donde está la unión discriminada que Payload valida. Aquí se reexporta
 * para poder importar el bloque entero desde `blocks/media-text`.
 */
export { mediaTextBlockSchema } from '../../schemas/collections/pages.schema';
