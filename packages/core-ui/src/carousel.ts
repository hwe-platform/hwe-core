/**
 * Entry point separado de `@hwe-platform/core-ui/carousel`.
 *
 * El barril principal (`index.ts`) es la única entrada de un módulo ESM:
 * cualquiera que importe **cualquier cosa** de `@hwe-platform/core-ui` —aunque
 * sea un solo schema Zod— evalúa el fichero entero, incluido cada
 * `import 'swiper/css'` de por medio. Un bundler con tree-shaking (Next,
 * webpack) lo descarta si no se usa; el CLI de Payload no —corre sobre Node
 * puro vía `tsx`, sin bundler— y `payload generate:types` fallaba con
 * `ERR_UNKNOWN_FILE_EXTENSION` al tropezar con el `.css` de Swiper, porque
 * `payload.config.ts` importa schemas de `@hwe-platform/core-ui` para sus
 * hooks de validación.
 *
 * Separar el carrusel en su propia subruta (`exports["./carousel"]` en
 * `package.json`) es lo único que rompe esa cadena: quien solo necesita un
 * schema no toca este fichero, y quien necesita el carrusel lo pide aquí, a
 * propósito.
 */
export { CarouselPrimitive, CarouselSlide, usePrefersReducedMotion } from './primitives/carousel';
export type {
  CarouselEffect,
  CarouselInstance,
  CarouselLabels,
  CarouselPrimitiveProps,
} from './primitives/carousel';
