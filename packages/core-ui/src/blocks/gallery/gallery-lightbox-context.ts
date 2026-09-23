// 'use client' — `createContext`/`useContext` no corren en un Server
// Component. `GalleryFigure` ya es cliente y lo arrastraría igual, pero este
// módulo también se exporta suelto desde el barril de Gallery y desde
// `core-ui/src/index.ts` (`useGalleryLightbox`): sin la directiva propia,
// cualquier camino que llegue aquí primero —no necesariamente a través de
// `GalleryFigure`— rompía `next build` con el mismo error que ya se vio en
// `usePrefersReducedMotion` (tramo 1 de HU-011).
'use client';

import { createContext, useContext } from 'react';

/** Lo que el contexto ofrece: abrir el visor en la imagen `indice`. */
export type GalleryLightboxContextValue = {
  abrir: (indice: number) => void;
};

/**
 * Contexto del lightbox, ambiental para toda variante de Gallery.
 *
 * `null` por defecto: es como `GalleryFigure` y `GallerySlideFigure` saben
 * que no hay lightbox que abrir —porque el bloque lo tiene desactivado, o
 * porque se usan sueltas fuera de `GalleryBlock`— y se quedan sin envolver
 * en botón. Ningún llamante tiene que pasar una prop de más: el proveedor
 * envuelve una vez, en `GalleryBlock`, y las figuras lo consumen solas.
 */
export const GalleryLightboxContext = createContext<GalleryLightboxContextValue | null>(null);

/** Abre el lightbox en la imagen `indice`, o no hace nada si está desactivado. */
export function useGalleryLightbox(): GalleryLightboxContextValue['abrir'] | null {
  const contexto = useContext(GalleryLightboxContext);
  return contexto?.abrir ?? null;
}
