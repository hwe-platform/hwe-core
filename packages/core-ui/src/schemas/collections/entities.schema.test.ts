import { describe, it, expect } from 'vitest';
import { entitySchema, entityRefSchema } from './entities.schema';

function minimalEntity(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ent-1',
    type: 'restaurant',
    name: 'Restaurant',
    slug: 'restaurant',
    shortDescription: 'Cuisine locale et produits frais',
    description: { root: {} },
    icon: 'utensils',
    image: 'media-1',
    ...overrides,
  };
}

describe('entitySchema', () => {
  it('valida una entidad mínima válida', () => {
    const result = entitySchema.safeParse(minimalEntity());
    expect(result.success).toBe(true);
  });

  it('rechaza un type que no está en el enum', () => {
    const result = entitySchema.safeParse(minimalEntity({ type: 'piscina' }));
    expect(result.success).toBe(false);
  });

  it('aplica featured = false, order = 0 y hasOwnPage = false por defecto', () => {
    const result = entitySchema.parse(minimalEntity());
    expect(result.featured).toBe(false);
    expect(result.order).toBe(0);
    expect(result.hasOwnPage).toBe(false);
  });

  it('valida schedule con periods e icon del enum permitido', () => {
    const result = entitySchema.safeParse(
      minimalEntity({
        schedule: {
          periods: [{ label: 'Déjeuner', icon: 'utensils', hours: '12h00 · 14h30' }],
        },
      }),
    );
    expect(result.success).toBe(true);
  });

  it('rechaza schedule con un icon fuera del enum', () => {
    const result = entitySchema.safeParse(
      minimalEntity({
        schedule: {
          periods: [{ label: 'Déjeuner', icon: 'fork', hours: '12h00 · 14h30' }],
        },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('category es opcional', () => {
    const result = entitySchema.safeParse(minimalEntity({ category: undefined }));
    expect(result.success).toBe(true);
  });

  it('rechaza ctas con variant fuera del enum', () => {
    const result = entitySchema.safeParse(
      minimalEntity({
        ctas: [{ label: 'Voir la carte', url: '/carte', variant: 'ghost' }],
      }),
    );
    expect(result.success).toBe(false);
  });
});

describe('entityRefSchema', () => {
  it('acepta un id sin poblar', () => {
    expect(entityRefSchema.safeParse('ent-1').success).toBe(true);
  });

  it('acepta un documento poblado', () => {
    expect(entityRefSchema.safeParse(minimalEntity()).success).toBe(true);
  });
});
