import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Sustituye `matchMedia`, que jsdom no implementa.
 *
 * Devuelve el conjunto de oyentes para poder disparar un cambio de preferencia
 * y comprobar que el hook se da de baja al desmontar.
 */
function simularPreferencia(reducido: boolean) {
  const oyentes = new Set<() => void>();
  const consulta = {
    matches: reducido,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_evento: string, oyente: () => void) => {
      oyentes.add(oyente);
    },
    removeEventListener: (_evento: string, oyente: () => void) => {
      oyentes.delete(oyente);
    },
  };

  vi.stubGlobal('matchMedia', () => consulta);

  return { consulta, oyentes };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePrefersReducedMotion', () => {
  it('devuelve false cuando el navegador no expone matchMedia', () => {
    // Es el caso de jsdom sin tocar nada, y también el del render de servidor.
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('devuelve false cuando el sistema no pide movimiento reducido', () => {
    simularPreferencia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('devuelve true cuando el sistema pide movimiento reducido', () => {
    simularPreferencia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('reacciona cuando la preferencia cambia sin recargar la página', () => {
    const { consulta, oyentes } = simularPreferencia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      consulta.matches = true;
      oyentes.forEach((oyente) => oyente());
    });

    expect(result.current).toBe(true);
  });

  it('se da de baja del oyente al desmontar', () => {
    const { oyentes } = simularPreferencia(false);
    const { unmount } = renderHook(() => usePrefersReducedMotion());

    expect(oyentes.size).toBe(1);

    unmount();

    expect(oyentes.size).toBe(0);
  });
});
