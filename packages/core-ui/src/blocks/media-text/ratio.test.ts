import { describe, it, expect } from 'vitest';

import { columnasDe, PROPORCIONES, DEFAULT_SPLIT, COLUMNAS_RETICULA } from './ratio';

describe('columnasDe', () => {
  it('da la clase del reparto pedido', () => {
    expect(columnasDe(5)).toBe('lg:col-span-5');
    expect(columnasDe(7)).toBe('lg:col-span-7');
  });

  it('cubre el dominio entero del eje, de 1 a 11', () => {
    for (let split = 1; split < COLUMNAS_RETICULA; split += 1) {
      expect(columnasDe(split)).toBe(`lg:col-span-${split}`);
    }
  });

  it('cae al reparto por defecto si el número está fuera de tabla', () => {
    // No pasa por el bloque, que valida antes; sí por un override o un test
    // que renderice con datos crudos. Sin respaldo el tramo se quedaría sin
    // clase de columna y la fila saldría rota.
    expect(columnasDe(99)).toBe(`lg:col-span-${DEFAULT_SPLIT}`);
    expect(columnasDe(0)).toBe(`lg:col-span-${DEFAULT_SPLIT}`);
  });
});

describe('PROPORCIONES', () => {
  it('cada valor del eje dibuja un marco con alto propio', () => {
    // Hubo un cuarto valor, `auto`, que se retiró por no cumplir esto: el
    // marco solo contiene elementos en posición absoluta, así que sin
    // proporción se quedaba a cero de alto.
    for (const clase of Object.values(PROPORCIONES)) {
      expect(clase).toMatch(/^aspect-/);
    }
  });
});
