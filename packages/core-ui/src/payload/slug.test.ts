import { describe, it, expect } from 'vitest';
import { slugify, resolveSlug } from './slug';

describe('slugify', () => {
  it('pasa a minúsculas y cambia espacios por guiones', () => {
    expect(slugify('Mobile Home Confort 3 chambres')).toBe('mobile-home-confort-3-chambres');
  });

  it('quita los acentos del francés y del español', () => {
    expect(slugify('Épicerie')).toBe('epicerie');
    expect(slugify('Hébergements à la carte')).toBe('hebergements-a-la-carte');
    expect(slugify('Año Nuevo')).toBe('ano-nuevo');
  });

  it('convierte los caracteres que NFD no descompone', () => {
    expect(slugify('Straße')).toBe('strasse');
    expect(slugify('Cœur')).toBe('coeur');
  });

  it('colapsa separadores consecutivos en un solo guion', () => {
    expect(slugify('Village   &   port')).toBe('village-port');
  });

  it('no deja guiones sueltos al principio ni al final', () => {
    expect(slugify('  ¡Hola!  ')).toBe('hola');
  });

  it('elimina la barra en lugar de tratarla como separador de ruta', () => {
    expect(slugify('locations/mobile-home')).toBe('locations-mobile-home');
  });

  it('devuelve cadena vacía si no queda nada utilizable', () => {
    expect(slugify('!!!')).toBe('');
  });
});

describe('resolveSlug', () => {
  it('deriva el slug del título cuando no hay slug manual', () => {
    expect(resolveSlug({ source: 'Le Camping' })).toBe('le-camping');
  });

  it('respeta el slug manual del editor', () => {
    expect(resolveSlug({ current: 'custom', source: 'Le Camping' })).toBe('custom');
  });

  it('normaliza también el slug manual', () => {
    expect(resolveSlug({ current: 'Le Camping' })).toBe('le-camping');
  });

  it('cae al título si el slug manual se queda vacío al normalizar', () => {
    expect(resolveSlug({ current: '!!!', source: 'Le Camping' })).toBe('le-camping');
  });

  it('devuelve undefined si no hay ni slug ni título', () => {
    expect(resolveSlug({})).toBeUndefined();
    expect(resolveSlug({ current: null, source: null })).toBeUndefined();
  });
});
