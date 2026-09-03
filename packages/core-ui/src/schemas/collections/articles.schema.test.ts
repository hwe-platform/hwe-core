import { describe, it, expect } from 'vitest';
import { articleSchema, articleRefSchema } from './articles.schema';

function minimalArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: 'art-1',
    title: 'Nos conseils pour un séjour réussi',
    slug: 'nos-conseils-pour-un-sejour-reussi',
    excerpt: "Tout ce qu'il faut savoir avant de partir",
    content: { root: {} },
    image: 'media-1',
    category: 'Camping',
    publishedAt: '2026-06-01',
    seo: {},
    ...overrides,
  };
}

describe('articleSchema', () => {
  it('valida un artículo mínimo válido', () => {
    const result = articleSchema.safeParse(minimalArticle());
    expect(result.success).toBe(true);
  });

  it('convierte publishedAt en un objeto Date', () => {
    const result = articleSchema.parse(minimalArticle());
    expect(result.publishedAt).toBeInstanceOf(Date);
  });

  it('aplica featured = false por defecto', () => {
    const result = articleSchema.parse(minimalArticle());
    expect(result.featured).toBe(false);
  });

  it('author es opcional', () => {
    const result = articleSchema.safeParse(minimalArticle({ author: undefined }));
    expect(result.success).toBe(true);
  });

  it('rechaza un artículo sin excerpt', () => {
    const { excerpt: _excerpt, ...withoutExcerpt } = minimalArticle();
    const result = articleSchema.safeParse(withoutExcerpt);
    expect(result.success).toBe(false);
  });

  it('rechaza publishedAt con un valor no interpretable como fecha', () => {
    const result = articleSchema.safeParse(minimalArticle({ publishedAt: 'no-es-una-fecha' }));
    expect(result.success).toBe(false);
  });
});

describe('articleRefSchema', () => {
  it('acepta un id sin poblar', () => {
    expect(articleRefSchema.safeParse('art-1').success).toBe(true);
  });

  it('acepta un documento poblado', () => {
    expect(articleRefSchema.safeParse(minimalArticle()).success).toBe(true);
  });
});
