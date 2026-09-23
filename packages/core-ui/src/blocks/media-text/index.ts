// `MediaCarousel` **no se reexporta aquí, a propósito**: tira de
// `CarouselPrimitive` → Swiper, y este barril cuelga de
// `core-ui/src/index.ts`. Un `export … from` estático evaluaría el módulo
// entero aunque nadie pida ese nombre. Solo `MediaTextBlock` la toca, y lo
// hace con `next/dynamic` — mismo patrón que `blocks/gallery/index.ts`.
export { MediaTextBlock } from './MediaTextBlock';
export { MediaEmbed } from './MediaEmbed';
export { MediaImage } from './MediaImage';
export { mediaTextBlockSchema } from './media-text.schema';
export type { MediaTextProps } from './MediaTextBlock';
export type {
  MediaTextData,
  MediaTextSlots,
  MediaTextLabels,
  MediaSlotProps,
} from './media-text.types';
