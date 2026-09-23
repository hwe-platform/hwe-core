import type { z } from 'zod';
import type { galleryBlockSchema } from './gallery.schema';

/** Datos del bloque, derivados del schema Zod (DEC-004). */
export type GalleryData = z.infer<typeof galleryBlockSchema>;

/** Una imagen de la galería, ya validada. */
export type GalleryImage = GalleryData['images'][number];

/** Props que comparten las variantes estáticas (grid, masonry, collage). */
export type GalleryVariantProps = {
  bloque: GalleryData;
};
