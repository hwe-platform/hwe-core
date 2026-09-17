import { describe, it, expect } from 'vitest';
import { resolveRoute, splitLocale, localeRedirect, ROUTABLE_COLLECTIONS } from './resolve-route';

describe('resolveRoute', () => {
  it('sin segmentos resuelve la home', () => {
    expect(resolveRoute({})).toEqual({ kind: 'home' });
    expect(resolveRoute({ slug: [] })).toEqual({ kind: 'home' });
  });

  it('un segmento se busca como slug', () => {
    expect(resolveRoute({ slug: ['le-camping'] })).toEqual({
      kind: 'document',
      slug: 'le-camping',
      collections: ROUTABLE_COLLECTIONS,
    });
  });

  it('reúne varios segmentos en un solo slug, porque las URLs son libres', () => {
    const result = resolveRoute({ slug: ['locations', 'mobil-home-confort'] });
    expect(result).toMatchObject({ slug: 'locations/mobil-home-confort' });
  });

  it('ignora segmentos vacíos', () => {
    expect(resolveRoute({ slug: ['', 'le-camping', ''] })).toMatchObject({ slug: 'le-camping' });
    expect(resolveRoute({ slug: ['', ''] })).toEqual({ kind: 'home' });
  });

  it('consulta las colecciones en el orden de la spec', () => {
    expect(ROUTABLE_COLLECTIONS).toEqual(['pages', 'accommodations', 'entities', 'articles']);
  });
});

const config = { locales: ['fr', 'en', 'es'], prefixDefault: false } as const;

describe('splitLocale', () => {
  it('reconoce el prefijo de un idioma disponible', () => {
    expect(splitLocale('/en/the-campsite', config)).toEqual({
      locale: 'en',
      pathname: '/the-campsite',
      hadPrefix: true,
    });
  });

  it('sin prefijo devuelve el idioma principal', () => {
    expect(splitLocale('/le-camping', config)).toEqual({
      locale: 'fr',
      pathname: '/le-camping',
      hadPrefix: false,
    });
  });

  it('la raíz resuelve al idioma principal', () => {
    expect(splitLocale('/', config)).toEqual({ locale: 'fr', pathname: '/', hadPrefix: false });
  });

  it('un prefijo de idioma solo deja la raíz', () => {
    expect(splitLocale('/en', config)).toEqual({ locale: 'en', pathname: '/', hadPrefix: true });
  });

  it('no confunde un slug que parece idioma pero no lo es', () => {
    expect(splitLocale('/de/etwas', config)).toMatchObject({
      locale: 'fr',
      pathname: '/de/etwas',
      hadPrefix: false,
    });
  });

  it('conserva la profundidad del resto de la ruta', () => {
    expect(splitLocale('/es/alojamientos/mobil-home', config)).toMatchObject({
      locale: 'es',
      pathname: '/alojamientos/mobil-home',
    });
  });
});

describe('localeRedirect', () => {
  it('no redirige si el idioma principal no lleva prefijo', () => {
    expect(localeRedirect('/le-camping', config)).toBeUndefined();
  });

  it('redirige al prefijo cuando el cliente lo exige', () => {
    const conPrefijo = { ...config, prefixDefault: true };
    expect(localeRedirect('/le-camping', conPrefijo)).toBe('/fr/le-camping');
  });

  it('redirige también la raíz, sin dejar barra doble', () => {
    const conPrefijo = { ...config, prefixDefault: true };
    expect(localeRedirect('/', conPrefijo)).toBe('/fr');
  });

  it('no redirige una URL que ya trae prefijo', () => {
    const conPrefijo = { ...config, prefixDefault: true };
    expect(localeRedirect('/en/the-campsite', conPrefijo)).toBeUndefined();
  });
});
