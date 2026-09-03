import { describe, it, expect } from 'vitest';
import { seoSchema, personalizationEntrySchema } from './common.schema';

describe('seoSchema', () => {
  it('valida un objeto vacío — todos los campos son opcionales', () => {
    const result = seoSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('valida metaTitle, metaDescription y ogImage como id', () => {
    const result = seoSchema.safeParse({
      metaTitle: 'Camping La Civelle',
      metaDescription: 'Camping familiar en las Landas',
      ogImage: 'media-1',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza metaTitle con tipo incorrecto', () => {
    const result = seoSchema.safeParse({ metaTitle: 123 });
    expect(result.success).toBe(false);
  });
});

describe('personalizationEntrySchema', () => {
  it('valida una entrada con segment e image obligatorios', () => {
    const result = personalizationEntrySchema.safeParse({
      segment: 'familias',
      image: 'media-1',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza una entrada sin segment', () => {
    const result = personalizationEntrySchema.safeParse({ image: 'media-1' });
    expect(result.success).toBe(false);
  });

  it('acepta gallery como opcional', () => {
    const result = personalizationEntrySchema.safeParse({
      segment: 'familias',
      image: 'media-1',
      gallery: ['media-2', 'media-3'],
    });
    expect(result.success).toBe(true);
  });
});
