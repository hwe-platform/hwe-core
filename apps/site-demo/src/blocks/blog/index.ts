/**
 * Listado de artículos de este site.
 *
 * Hoy es el de plataforma sin cambios. El fichero existe igualmente porque es
 * lo que hace **descubrible** la personalización: quien tenga que adaptarlo
 * encuentra aquí el punto de entrada en vez de tener que averiguar que existe
 * (ver "Tres niveles de uso por cliente" en `docs/arquitectura/bloques.md`).
 *
 * Los artículos no se resuelven aquí: los inyecta `blocks/resolve.ts` antes de
 * renderizar, porque quien consulta Payload es la plantilla, no el bloque.
 */
export { BlogBlock } from '@hwe-platform/core-ui';
