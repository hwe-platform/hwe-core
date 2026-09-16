import { describe, it, expect } from 'vitest';
import {
  categorySchema,
  categoryInputSchema,
  categoryUpdateSchema,
  mediaInputSchema,
  accommodationInputSchema,
  entityInputSchema,
  pageInputSchema,
  articleInputSchema,
} from './collections';
import { bannerInputSchema, bannerUpdateSchema } from './globals';

/**
 * Los schemas `*Input` son el boundary de escritura de Payload (DEC-004).
 * Lo que se comprueba aquí es el contrato que los hace utilizables desde un
 * `beforeChange`, no de nuevo la forma de cada colección.
 */
const collectionInputs = [
  ['media', mediaInputSchema],
  ['categories', categoryInputSchema],
  ['accommodations', accommodationInputSchema],
  ['entities', entityInputSchema],
  ['pages', pageInputSchema],
  ['articles', articleInputSchema],
] as const;

describe('schemas de escritura de colecciones', () => {
  it.each(collectionInputs)('%s: no declara id, que lo asigna Payload', (_name, schema) => {
    expect(Object.keys(schema.shape)).not.toContain('id');
  });

  it('acepta una categoría nueva sin id', () => {
    const result = categoryInputSchema.safeParse({ name: 'Locations', slug: 'locations' });
    expect(result.success).toBe(true);
  });

  it('el schema de lectura sí exige id', () => {
    const result = categorySchema.safeParse({ name: 'Locations', slug: 'locations' });
    expect(result.success).toBe(false);
  });

  it('descarta el id si Payload lo cuela en los datos de entrada', () => {
    const parsed = categoryInputSchema.parse({ id: 'cat-1', name: 'Locations', slug: 'locations' });
    expect(parsed).not.toHaveProperty('id');
  });

  it('la variante update acepta solo los campos que cambian', () => {
    const result = categoryUpdateSchema.safeParse({ order: 3 });
    expect(result.success).toBe(true);
  });

  it('la variante create sigue exigiendo los campos obligatorios', () => {
    const result = categoryInputSchema.safeParse({ order: 3 });
    expect(result.success).toBe(false);
  });
});

describe('schemas de escritura de globals', () => {
  it('no omite id porque los globals no lo tienen', () => {
    const result = bannerInputSchema.safeParse({
      enabled: true,
      message: 'Ouverture le 1er avril',
      type: 'info',
      dismissible: true,
    });
    expect(result.success).toBe(true);
  });

  it('la variante update acepta un guardado parcial', () => {
    expect(bannerUpdateSchema.safeParse({ enabled: false }).success).toBe(true);
  });
});
