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
