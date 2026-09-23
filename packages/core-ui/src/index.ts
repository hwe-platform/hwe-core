// Entry point de @hwe-platform/core-ui. Se irá llenando con los exports de
// layout/ y adapters/ conforme se implementen (ver historias/ en hwe-tools).
export * from './schemas';
export * from './theme/token-contract';
export * from './primitives';
export * from './lib/media';
export * from './payload';
export * from './renderer';
export * from './blocks';
export * from './layout';

// Bloques construidos desde el Figma (HU-009)
export type { MediaRef, MediaData } from './schemas/collections/media.types';

export type { BlockSlots, SlotRegistry, BlockComponentProps } from './renderer/types';

export { HeroBlock, heroSchema } from './blocks/hero';
export type { HeroProps, HeroData, HeroLabels, Breadcrumb, HeroVariantProps } from './blocks/hero';

export { BlockCtas, fondoDe } from './blocks/seccion';
export type { BlockLink, BlockCtasProps } from './blocks/seccion';

export { BlogBlock, blogBlockSchema, consultaDeBlog, articuloATarjeta } from './blocks/blog';
export type {
  BlogProps,
  BlogData,
  ConsultaDeBlog,
  ArticuloResuelto,
  OpcionesDeTarjeta,
} from './blocks/blog';

export { CardGridBlock, CardOverlay, CardStacked, cardGridBlockSchema } from './blocks/card-grid';
export type { CardGridProps, CardGridData, CardGridItem, CardProps } from './blocks/card-grid';

export { IconGridBlock, IconGridBare, IconGridCard, iconGridBlockSchema } from './blocks/icon-grid';
export type {
  IconGridProps,
  IconGridData,
  IconGridItem,
  IconGridVariantProps,
  IconRegistry,
} from './blocks/icon-grid';

export {
  MediaTextBlock,
  MediaImage,
  MediaEmbed,
  MediaCarousel,
  mediaTextBlockSchema,
} from './blocks/media-text';
export type {
  MediaTextProps,
  MediaTextData,
  MediaTextSlots,
  MediaTextLabels,
} from './blocks/media-text';

// Carrusel (HU-011). Va fuera del barril de `primitives/` para que se lea de
// dónde cuelga, pero **eso no le ahorra la hoja de Swiper a nadie**: este
// fichero ya hace `export * from './primitives'` arriba y es la única entrada
// del paquete (`exports` solo declara `"."`), así que quien importe
// `@hwe-platform/core-ui` arrastra el CSS del carrusel —un `import 'swiper/css'`
// es un efecto secundario que ningún bundler elimina—. Acotarlo de verdad pide
// una subruta `./carousel` en el `exports` del paquete; está sin decidir.
export { CarouselPrimitive, CarouselSlide, usePrefersReducedMotion } from './primitives/carousel';
export type {
  CarouselEffect,
  CarouselInstance,
  CarouselLabels,
  CarouselPrimitiveProps,
} from './primitives/carousel';
