import type { MediaData, MediaRef } from '../schemas/collections/media.types';
import type { MediaSize } from '../primitives/Image';

/**
 * Comprueba si una referencia a media viene poblada.
 *
 * Payload devuelve el documento entero o solo su id, según la profundidad de
 * la consulta. Con `depth: 0` llega un id y no hay nada que pintar.
 */
export function isPopulatedMedia(ref: MediaRef | null | undefined): ref is MediaData {
  return typeof ref === 'object' && ref !== null;
}

/**
 * URL de una referencia a media, o `undefined` si no se puede resolver.
 *
 * Con `size` devuelve la variante pedida y cae a la original si Payload no la
 * generó — las variantes solo existen cuando la imagen original es mayor que
 * el tamaño destino, así que una foto pequeña no tiene `hero`.
 *
 * @example
 * mediaUrl(block.image)             // la original
 * mediaUrl(block.image, 'card')     // la de 800px, o la original si no existe
 */
export function mediaUrl(ref: MediaRef | null | undefined, size?: MediaSize): string | undefined {
  if (!isPopulatedMedia(ref)) return undefined;
  if (!size) return ref.url;

  return ref.sizes?.[size]?.url ?? ref.url;
}

/**
 * Texto alternativo de una referencia a media.
 *
 * `alt` es obligatorio en la colección, así que un documento poblado siempre
 * lo trae. La cadena vacía es el valor correcto para una imagen decorativa.
 */
export function mediaAlt(ref: MediaRef | null | undefined): string {
  return isPopulatedMedia(ref) ? ref.alt : '';
}
