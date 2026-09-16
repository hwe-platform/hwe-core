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

/** Bloque media-text completo, para los tests que solo necesitan uno válido. */
function mediaTextBlock(overrides: Record<string, unknown> = {}) {
  return {
    blockType: 'media-text',
    content: {},
    image: 'media-1',
    ...overrides,
  };
}

describe('pageBlockSchema', () => {
  it('valida por su blockType los bloques que siguen siendo stubs', () => {
    const blockTypes = [
      'reviews-grid',
      'services-grid',
      'accommodations-grid',
      'environment-grid',
      'gallery',
      'map',
      'instagram',
      'blog',
      'faq',
      'embed',
    ];

    for (const blockType of blockTypes) {
      const result = pageBlockSchema.safeParse({ blockType });
      expect(result.success).toBe(true);
    }
  });

  it('exige los campos de los cinco bloques ya implementados', () => {
    expect(pageBlockSchema.safeParse({ blockType: 'media-text' }).success).toBe(false);
    expect(pageBlockSchema.safeParse(mediaTextBlock()).success).toBe(true);
  });

  it('aplica imagePosition = left por defecto en media-text', () => {
    const result = pageBlockSchema.parse(mediaTextBlock());
    expect(result).toHaveProperty('imagePosition', 'left');
  });

  it('valida icon-grid con sus items', () => {
    const result = pageBlockSchema.safeParse({
      blockType: 'icon-grid',
      items: [{ icon: 'wifi', label: 'Wi-Fi gratuit' }],
    });
    expect(result.success).toBe(true);
  });

  it('valida cta con sus enlaces y su variante por defecto', () => {
    const result = pageBlockSchema.parse({
      blockType: 'cta',
      links: [{ label: 'Réserver', url: '/reserver' }],
    });
    expect(result).toHaveProperty('links.0.variant', 'primary');
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
        blocks: [mediaTextBlock(), { blockType: 'faq' }],
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
    expect(result.seo?.noIndex).toBe(false);
  });

  it('acepta una página sin grupo seo: todos sus campos son opcionales', () => {
    const { seo: _seo, ...sinSeo } = minimalPage();
    expect(pageSchema.safeParse(sinSeo).success).toBe(true);
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
