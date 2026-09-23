'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import { GalleryLightboxContext } from './gallery-lightbox-context';

import type { ReactNode } from 'react';
import type { GalleryImage } from './gallery.types';

/**
 * El visor en sí, bajo demanda — igual que `slider`/`slider-thumbs` en
 * `GalleryBlock`, y por el mismo motivo: tira de `CarouselPrimitive`, que
 * tira de Swiper. Con un `import` estático aquí, **toda** galería —incluida
 * una `grid` sin una sola foto de carrusel— cargaría Swiper solo por tener
 * `lightbox: true`, que es el valor por defecto del schema. Con `dynamic`,
 * el código del visor no se pide hasta el primer click.
 */
const GalleryLightbox = dynamic(() => import('./GalleryLightbox').then((m) => m.GalleryLightbox));

export type GalleryLightboxProviderProps = {
  images: GalleryImage[];
  children: ReactNode;
};

/**
 * Monta el contexto del lightbox una vez por `GalleryBlock`, y el visor en
 * sí cuando hay una imagen abierta.
 *
 * **No se monta si el bloque tiene `lightbox: false`.** `GalleryBlock` no
 * renderiza este componente en ese caso — no hay una prop `enabled` aquí
 * a propósito: sin proveedor, `useGalleryLightbox()` devuelve `null` y las
 * figuras no se envuelven en botón. Es el mismo patrón que el resto del
 * catálogo usa para lo opcional: ausente, no apagado.
 */
export function GalleryLightboxProvider({ images, children }: GalleryLightboxProviderProps) {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(null);
  // Estable entre renders: `useLightboxLifecycle` la lleva en las
  // dependencias de su `useEffect`, y una función nueva en cada render de
  // este proveedor lo desmontaría y remontaría sin motivo.
  const cerrar = useCallback(() => setIndiceAbierto(null), []);

  return (
    <GalleryLightboxContext.Provider value={{ abrir: setIndiceAbierto }}>
      {children}
      {indiceAbierto !== null ? (
        <GalleryLightbox images={images} indiceInicial={indiceAbierto} onClose={cerrar} />
      ) : null}
    </GalleryLightboxContext.Provider>
  );
}
