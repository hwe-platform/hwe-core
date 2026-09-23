'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { CarouselPrimitive, CarouselSlide } from '../../primitives/carousel';
import { GalleryLightboxSlide } from './GalleryLightboxSlide';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { useFocusTrap } from './useFocusTrap';
import { useLightboxLifecycle } from './useLightboxLifecycle';

import type { MouseEvent } from 'react';
import type { GalleryImage } from './gallery.types';

/** Cierra solo si el clic fue sobre el propio fondo, no sobre algo dentro. */
function alPulsarFondo(evento: MouseEvent<HTMLDivElement>, onClose: () => void) {
  if (evento.target === evento.currentTarget) onClose();
}

export type GalleryLightboxProps = {
  images: GalleryImage[];
  /** Índice de la imagen en la que se abre — la que el usuario pulsó. */
  indiceInicial: number;
  /** Rótulo del cierre. Sin fuente en el Figma: el export no lleva lightbox. */
  cerrarLabel?: string;
  onClose: () => void;
};

/**
 * Visor a pantalla completa. Transversal a las cinco variantes: cualquiera
 * abre el mismo lightbox, con la imagen pulsada como punto de partida.
 *
 * Zoom, navegación y teclado los da el módulo Zoom de Swiper — nada de esto
 * es una librería de lightbox aparte, que es justo lo que HU-011 pide evitar.
 *
 * Sin loop: en un visor a pantalla completa, volver al principio de golpe al
 * pasar la última es más desorientador que útil — el usuario ya ve el
 * contador y sabe cuántas quedan.
 *
 * El `onClick` de cierre por fondo va en el wrapper interior
 * (`h-full w-full`), no en el `div[role=dialog]` que lo envuelve: es ese
 * wrapper el que de verdad ocupa el área visible del overlay — el diálogo
 * exterior no deja ningún hueco propio, así que un `target === currentTarget`
 * puesto ahí no se cumple nunca en un navegador real.
 */
export function GalleryLightbox({
  images,
  indiceInicial,
  cerrarLabel = 'Fermer',
  onClose,
}: GalleryLightboxProps) {
  const dialogoRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogoRef, true);
  useLightboxLifecycle(onClose);

  return createPortal(
    <div
      ref={dialogoRef}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie photos"
      // z-[200] y no z-50: el chrome del site llega hasta z-100
      // (`FloatingActions`, `MobileMenu` — ver layout/), y un modal tiene que
      // ganar siempre, no empatar. Con z-50 la `TopBar` (z-[60]) se veía por
      // encima del fondo oscuro — bug real, cazado con la demo de HU-011.
      className="fixed inset-0 z-[200] bg-black/90"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label={cerrarLabel}
        className="text-primary-foreground absolute right-4 top-4 z-10 size-10 px-0 hover:bg-white/10"
      >
        <Icon name="x" />
      </Button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- el fondo cierra al pulsarlo, Escape ya cubre el equivalente de teclado */}
      <div
        className="h-full w-full p-4 md:p-12"
        onClick={(evento) => alPulsarFondo(evento, onClose)}
      >
        <CarouselPrimitive
          navigation
          keyboard
          zoom
          loop={false}
          initialSlide={indiceInicial}
          className="h-full"
        >
          {images.map((item, indice) => (
            <CarouselSlide key={`${item.alt}-${indice}`}>
              <GalleryLightboxSlide item={item} priority={indice === indiceInicial} />
            </CarouselSlide>
          ))}
        </CarouselPrimitive>
      </div>
    </div>,
    document.body,
  );
}
