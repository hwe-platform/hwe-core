import { describe, it, expect } from 'vitest';
import { categorySchema, categoryRefSchema } from './categories.schema';

const validCategory = {
  id: 'cat-1',
  name: 'Emplacements',
  slug: 'emplacements',
};

describe('categorySchema', () => {
  it('valida una categoría con los campos obligatorios', () => {
    const result = categorySchema.safeParse(validCategory);
    expect(result.success).toBe(true);
  });

  it('aplica order = 0 por defecto', () => {
    const result = categorySchema.parse(validCategory);
    expect(result.order).toBe(0);
  });

  it('acepta description como opcional', () => {
    const result = categorySchema.safeParse({ ...validCategory, description: undefined });
    expect(result.success).toBe(true);
  });

  it('rechaza una categoría sin slug', () => {
    const { slug: _slug, ...withoutSlug } = validCategory;
    const result = categorySchema.safeParse(withoutSlug);
    expect(result.success).toBe(false);
  });
});

describe('categoryRefSchema', () => {
  it('acepta un id sin poblar', () => {
    expect(categoryRefSchema.safeParse('cat-1').success).toBe(true);
  });

  it('acepta un documento poblado', () => {
    expect(categoryRefSchema.safeParse(validCategory).success).toBe(true);
  });
});
