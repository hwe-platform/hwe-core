// 'use client' — aunque este archivo solo tenga un hook y ningún componente.
// El barril del carrusel lo exporta, y ese barril cuelga de `core-ui/index.ts`,
// que importan el middleware y `payload.config.ts`: sin esta línea el módulo
// entra en el grafo de servidor y `next build` falla —no `next dev`, que no lo
// alcanzaba— con «useSyncExternalStore is only available in Client Components».
'use client';

import { useSyncExternalStore } from 'react';

/** Consulta de medios con la que el sistema expresa «quiero menos movimiento». */
const CONSULTA = '(prefers-reduced-motion: reduce)';

/**
 * Comprueba si se puede preguntar al navegador.
 *
 * En el servidor no hay `window`, y en jsdom hay `window` pero no `matchMedia`
 * —no lo implementa—, así que no basta con mirar si estamos en el navegador.
 */
function hayConsultaDeMedios(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/** Se suscribe a los cambios de la preferencia y devuelve cómo darse de baja. */
function suscribir(avisar: () => void): () => void {
  if (!hayConsultaDeMedios()) return () => {};

  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener('change', avisar);

  return () => consulta.removeEventListener('change', avisar);
}

/** Valor actual de la preferencia en el navegador. */
function leer(): boolean {
  return hayConsultaDeMedios() ? window.matchMedia(CONSULTA).matches : false;
}

/**
 * Valor durante el render del servidor.
 *
 * `false` y no `true`: el servidor no sabe qué prefiere quien mira, y arrancar
 * suponiendo movimiento reducido dejaría el carrusel quieto en el primer
 * pintado para todo el mundo. El cliente corrige en cuanto monta.
 */
function leerEnServidor(): boolean {
  return false;
}

/**
 * Si quien visita la página ha pedido menos movimiento en su sistema.
 *
 * Es una preferencia de accesibilidad, no un ajuste del site: quien la activa
 * suele hacerlo por mareo o migraña, así que lo que devuelve este hook no se
 * negocia con la configuración del bloque — el autoplay se apaga y ya está.
 *
 * @returns `true` si el sistema pide movimiento reducido
 *
 * @example
 * const menosMovimiento = usePrefersReducedMotion();
 * const autoplayReal = autoplay && !menosMovimiento;
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(suscribir, leer, leerEnServidor);
}
