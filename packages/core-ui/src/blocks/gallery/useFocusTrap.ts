'use client';

import { useEffect } from 'react';

import type { RefObject } from 'react';

/** Selectores de lo que un usuario de teclado puede alcanzar con Tab. */
const SELECTOR_FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Los elementos alcanzables por teclado dentro de un contenedor, en orden de foco. */
function focosDe(contenedor: HTMLElement): HTMLElement[] {
  return Array.from(contenedor.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLE));
}

/**
 * Atrapa el foco dentro de un diálogo mientras está abierto, y lo devuelve a
 * quien lo abrió al cerrarse — regla de accesibilidad del lightbox (HU-011,
 * criterio «Focus trap al abrir, devuelve foco al cerrar»).
 *
 * Sin esto, Tab se escapa del visor hacia la página de detrás, invisible
 * bajo el overlay: quien navega por teclado se pierde sin saber por qué.
 *
 * @param ref - El contenedor del diálogo. Debe existir mientras `activo`.
 * @param activo - Si el diálogo está abierto.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useFocusTrap(ref, abierto);
 * return abierto ? <div ref={ref} role="dialog">...</div> : null;
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, activo: boolean): void {
  useEffect(() => {
    if (!activo) return;

    const quienAbrio = document.activeElement as HTMLElement | null;
    const contenedor = ref.current;
    const primero = contenedor ? focosDe(contenedor)[0] : null;
    (primero ?? contenedor)?.focus();

    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key !== 'Tab' || !contenedor) return;

      const focos = focosDe(contenedor);
      if (focos.length === 0) return;

      const primerFoco = focos[0];
      const ultimoFoco = focos[focos.length - 1];
      const activoActual = document.activeElement;

      // Cicla dentro del contenedor: del último al primero hacia delante,
      // del primero al último hacia atrás. Sin esto Tab se escapa del diálogo.
      if (!evento.shiftKey && activoActual === ultimoFoco) {
        evento.preventDefault();
        primerFoco.focus();
      } else if (evento.shiftKey && activoActual === primerFoco) {
        evento.preventDefault();
        ultimoFoco.focus();
      }
    }

    document.addEventListener('keydown', alPulsarTecla);

    return () => {
      document.removeEventListener('keydown', alPulsarTecla);
      quienAbrio?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `ref` es estable (useRef); solo `activo` debe reabrir el efecto.
  }, [activo]);
}
