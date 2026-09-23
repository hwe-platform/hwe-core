/**
 * El schema de `gallery` vive con el resto de bloques en `pages.schema.ts`,
 * que es donde está la unión discriminada que Payload valida. Aquí se reexporta
 * para poder importar el bloque entero desde `blocks/gallery`.
 */
export { galleryBlockSchema } from '../../schemas/collections/pages.schema';
