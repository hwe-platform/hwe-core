import { describe, it, expect } from 'vitest';
import { normalizePayloadData } from './normalize-payload-data';

describe('normalizePayloadData', () => {
  it('quita las claves con null, que es como Payload manda un opcional vacío', () => {
    expect(normalizePayloadData({ title: 'Accueil', parent: null })).toEqual({ title: 'Accueil' });
  });

  it('quita también undefined', () => {
    expect(normalizePayloadData({ a: 1, b: undefined })).toEqual({ a: 1 });
  });

  it('quita los group vacíos que Payload materializa como {}', () => {
    expect(normalizePayloadData({ name: 'Le Bar', schedule: {} })).toEqual({ name: 'Le Bar' });
  });

  it('quita un group que solo contenía nulls', () => {
    expect(normalizePayloadData({ hero: { media: null, title: null } })).toEqual({});
  });

  it('conserva los grupos con contenido real', () => {
    expect(normalizePayloadData({ specs: { capacity: 6, bedrooms: null } })).toEqual({
      specs: { capacity: 6 },
    });
  });

  it('conserva los arrays vacíos, que sí son un valor', () => {
    expect(normalizePayloadData({ blocks: [] })).toEqual({ blocks: [] });
  });

  it('limpia dentro de los elementos de un array', () => {
    expect(normalizePayloadData({ links: [{ label: 'Ir', url: '/ir', extra: null }] })).toEqual({
      links: [{ label: 'Ir', url: '/ir' }],
    });
  });

  it('conserva false y 0, que no son ausencia de valor', () => {
    expect(normalizePayloadData({ featured: false, order: 0 })).toEqual({
      featured: false,
      order: 0,
    });
  });

  it('conserva las cadenas vacías', () => {
    expect(normalizePayloadData({ caption: '' })).toEqual({ caption: '' });
  });

  it('no destroza una fecha', () => {
    const fecha = new Date('2026-04-01T00:00:00.000Z');
    expect(normalizePayloadData({ publishedAt: fecha })).toEqual({ publishedAt: fecha });
  });
});
