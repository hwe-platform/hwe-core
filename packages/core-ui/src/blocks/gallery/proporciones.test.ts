import { describe, expect, it } from 'vitest';

import { columnasDe, proporcionDe, reticulaDe } from './proporciones';

describe('proporcionDe', () => {
  it('devuelve la clase de cada proporción del dominio', () => {
    expect(proporcionDe('16/9')).toBe('aspect-video');
    expect(proporcionDe('4/3')).toBe('aspect-[4/3]');
    expect(proporcionDe('3/2')).toBe('aspect-[3/2]');
    expect(proporcionDe('1/1')).toBe('aspect-square');
  });

  it('auto no lleva clase de proporción', () => {
    expect(proporcionDe('auto')).toBe('');
  });

  it('cae a la proporción por defecto si el valor no está en tabla', () => {
    expect(proporcionDe('inventado')).toBe(proporcionDe('16/9'));
  });
});

describe('reticulaDe', () => {
  it('devuelve la retícula de 2, 3 y 4 columnas', () => {
    expect(reticulaDe(2)).toContain('sm:grid-cols-2');
    expect(reticulaDe(3)).toContain('md:grid-cols-3');
    expect(reticulaDe(4)).toContain('md:grid-cols-4');
  });

  it('cae a 3 columnas si el número está fuera de tabla', () => {
    expect(reticulaDe(7)).toBe(reticulaDe(3));
  });
});

describe('columnasDe', () => {
  it('devuelve las columnas CSS de 2, 3 y 4', () => {
    expect(columnasDe(2)).toContain('sm:columns-2');
    expect(columnasDe(3)).toContain('md:columns-3');
    expect(columnasDe(4)).toContain('md:columns-4');
  });

  it('cae a 3 columnas si el número está fuera de tabla', () => {
    expect(columnasDe(7)).toBe(columnasDe(3));
  });
});
