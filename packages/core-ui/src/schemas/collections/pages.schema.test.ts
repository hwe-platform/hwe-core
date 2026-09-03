import { describe, it, expect } from 'vitest';
import { pageSchema, pageBlockSchema } from './pages.schema';

function minimalPage(overrides: Record<string, unknown> = {}) {
  return {
    id: 'page-1',
    title: 'Accueil',
    slug: 'accueil',
    type: 'home',
    blocks: [],
    seo: {},
    ...overrides,
  };
}

describe('pageBlockSchema', () => {
  it('valida cada stub de bloque por su blockType', () => {
    const blockTypes = [
      'media-text',
      'icon-grid',
      'card-grid',
      'reviews-grid',
      'services-grid',
      'accommodations-grid',
      'environment-grid',
      'gallery',
      'map',
      'instagram',
      'blog',
      'cta',
      'faq',
      'rich-text',
      'embed',
    ];

    for (const blockType of blockTypes) {
      const result = pageBlockSchema.safeParse({ blockType });
      expect(result.success).toBe(true);
    }
  });

  it('rechaza un blockType desconocido', () => {
    const result = pageBlockSchema.safeParse({ blockType: 'unknown-block' });
    expect(result.success).toBe(false);
  });
});

describe('pageSchema', () => {
  it('valida una página mínima válida', () => {
    const result = pageSchema.safeParse(minimalPage());
    expect(result.success).toBe(true);
  });

  it('rechaza un type que no está en el enum', () => {
    const result = pageSchema.safeParse(minimalPage({ type: 'inicio' }));
    expect(result.success).toBe(false);
  });

  it('valida una secuencia de bloques mixta', () => {
    const result = pageSchema.safeParse(
      minimalPage({
        blocks: [{ blockType: 'media-text' }, { blockType: 'faq' }],
      }),
    );
    expect(result.success).toBe(true);
  });

  it('rechaza un bloque inválido dentro de blocks', () => {
    const result = pageSchema.safeParse(minimalPage({ blocks: [{ blockType: 'no-existe' }] }));
    expect(result.success).toBe(false);
  });

  it('aplica showBreadcrumbs = false por defecto dentro de hero', () => {
    const result = pageSchema.parse(minimalPage({ hero: { variant: 'minimal' } }));
    expect(result.hero?.showBreadcrumbs).toBe(false);
  });

  it('aplica noIndex = false por defecto dentro de seo', () => {
    const result = pageSchema.parse(minimalPage());
    expect(result.seo.noIndex).toBe(false);
  });

  it('acepta parent como id sin poblar', () => {
    const result = pageSchema.safeParse(minimalPage({ parent: 'page-0' }));
    expect(result.success).toBe(true);
  });

  it('acepta parent como referencia superficial poblada', () => {
    const result = pageSchema.safeParse(
      minimalPage({
        parent: { id: 'page-0', title: 'Le Camping', slug: 'le-camping' },
      }),
    );
    expect(result.success).toBe(true);
  });
});
