// `GallerySlider`, `GallerySliderThumbs`, `GallerySlideFigure` y
// `GalleryLightbox` **no se reexportan aquí, a propósito**. Este barril
// cuelga de `core-ui/src/index.ts` —la única entrada del paquete—, y un
// `export … from` estático evalúa el módulo entero para resolver el
// binding, aunque nadie pida ese nombre: eso arrastraría Swiper otra vez,
// exactamente el problema que `GalleryBlock` y `GalleryLightboxProvider`
// resuelven importándolas con `next/dynamic`. Solo ellos las tocan, y lo
// hacen con una ruta relativa que no pasa por aquí.
//
// `GalleryLightboxProvider` sí se reexporta: ya no importa el visor de
// forma estática (lo hace bajo demanda, dentro de sí misma), así que
// evaluarla aquí no toca Swiper.
export { GalleryBlock } from './GalleryBlock';
export { GalleryFigure } from './GalleryFigure';
export { GalleryGrid } from './GalleryGrid';
export { GalleryMasonry } from './GalleryMasonry';
export { GalleryCollage } from './GalleryCollage';
export { GalleryLightboxProvider } from './GalleryLightboxProvider';
export { useGalleryLightbox } from './gallery-lightbox-context';
export { galleryBlockSchema } from './gallery.schema';
export type { GalleryProps } from './GalleryBlock';
export type { GalleryData, GalleryImage, GalleryVariantProps } from './gallery.types';
