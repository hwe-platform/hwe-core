'use client';

import { useEffect } from 'react';

/**
 * Lo que un visor a pantalla completa necesita mientras está abierto: cerrar
 * con Escape (criterio de HU-011) y no dejar que la página de detrás se
 * desplace bajo el overlay — un scroll que el usuario no ve es peor que uno
 * que sí ve.
 *
 * Fuera de `GalleryLightbox` por lo mismo que `useFocusTrap`: es una
 * responsabilidad completa por sí sola, y meterla en el componente lo subía
 * por encima del límite de líneas de `codigo.md`.
 *
 * @param onClose - Se llama al pulsar Escape.
 */
export function useLightboxLifecycle(onClose: () => void): void {
  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', alPulsarTecla);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener('keydown', alPulsarTecla);
    };
  }, [onClose]);
}
