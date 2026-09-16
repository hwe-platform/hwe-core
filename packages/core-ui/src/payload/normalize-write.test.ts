import { describe, it, expect } from 'vitest';
import { normalizeWriteData } from './normalize-write';

describe('normalizeWriteData', () => {
  it('quita las claves con null, que es como Payload manda un opcional vacío', () => {
    expect(normalizeWriteData({ title: 'Accueil', parent: null })).toEqual({ title: 'Accueil' });
  });

  it('quita también undefined', () => {
    expect(normalizeWriteData({ a: 1, b: undefined })).toEqual({ a: 1 });
  });

  it('quita los group vacíos que Payload materializa como {}', () => {
    expect(normalizeWriteData({ name: 'Le Bar', schedule: {} })).toEqual({ name: 'Le Bar' });
  });

  it('quita un group que solo contenía nulls', () => {
    expect(normalizeWriteData({ hero: { media: null, title: null } })).toEqual({});
  });

  it('conserva los grupos con contenido real', () => {
    expect(normalizeWriteData({ specs: { capacity: 6, bedrooms: null } })).toEqual({
      specs: { capacity: 6 },
    });
  });

  it('conserva los arrays vacíos, que sí son un valor', () => {
    expect(normalizeWriteData({ blocks: [] })).toEqual({ blocks: [] });
  });

  it('limpia dentro de los elementos de un array', () => {
    expect(normalizeWriteData({ links: [{ label: 'Ir', url: '/ir', extra: null }] })).toEqual({
      links: [{ label: 'Ir', url: '/ir' }],
    });
  });

  it('conserva false y 0, que no son ausencia de valor', () => {
    expect(normalizeWriteData({ featured: false, order: 0 })).toEqual({
      featured: false,
      order: 0,
    });
  });

  it('conserva las cadenas vacías', () => {
    expect(normalizeWriteData({ caption: '' })).toEqual({ caption: '' });
  });

  it('no destroza una fecha', () => {
    const fecha = new Date('2026-04-01T00:00:00.000Z');
    expect(normalizeWriteData({ publishedAt: fecha })).toEqual({ publishedAt: fecha });
  });
});
