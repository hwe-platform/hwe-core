import { describe, it, expect } from 'vitest';

import { esAmplio, reticulaDe, COLUMNAS_POR_DEFECTO } from './grid';

describe('esAmplio', () => {
  it('es amplio hasta tres columnas y estrecho a partir de cuatro', () => {
    expect(esAmplio(1)).toBe(true);
    expect(esAmplio(3)).toBe(true);
    expect(esAmplio(4)).toBe(false);
    expect(esAmplio(6)).toBe(false);
  });
});

describe('reticulaDe', () => {
  it('reproduce las rampas del diseño de referencia', () => {
    // «Pourquoi choisir» arranca en una columna; «Nos Engagements» y
    // «Activités & Services» arrancan en dos con parada en tres.
    expect(reticulaDe(3)).toBe('grid grid-cols-1 lg:grid-cols-3');
    expect(reticulaDe(5)).toBe('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5');
    expect(reticulaDe(6)).toBe('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6');
  });

  it('una rejilla estrecha no pasa por más columnas de las que tiene', () => {
    // Sin esto, una de dos se ensancharía a tres en tablet y volvería a
    // encoger en escritorio.
    expect(reticulaDe(2)).toBe('grid grid-cols-1 lg:grid-cols-2');
  });

  it('cubre el dominio entero del eje', () => {
    for (let n = 1; n <= 12; n += 1) {
      expect(reticulaDe(n)).toContain(`lg:grid-cols-${n}`);
    }
  });

  it('cae a las columnas por defecto si el número está fuera de tabla', () => {
    // El schema lo acota, pero el bloque también se usa con datos crudos en
    // overrides y tests; sin respaldo la fila se quedaría sin clase.
    expect(reticulaDe(99)).toContain(`lg:grid-cols-${COLUMNAS_POR_DEFECTO}`);
    expect(reticulaDe(0)).toContain(`lg:grid-cols-${COLUMNAS_POR_DEFECTO}`);
  });
});
