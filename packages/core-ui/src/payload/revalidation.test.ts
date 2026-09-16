import { describe, it, expect } from 'vitest';
import { revalidationTags, SITE_GLOBAL_TAG } from './revalidation';

describe('revalidationTags', () => {
  it('incluye la colección, el documento y el tag global', () => {
    expect(revalidationTags({ collection: 'pages', slug: 'le-camping' })).toEqual([
      'pages',
      'pages-le-camping',
      SITE_GLOBAL_TAG,
    ]);
  });

  it('omite el tag de documento cuando no hay slug', () => {
    expect(revalidationTags({ collection: 'site-config' })).toEqual([
      'site-config',
      SITE_GLOBAL_TAG,
    ]);
  });

  it('trata el slug vacío o nulo como ausente', () => {
    expect(revalidationTags({ collection: 'header', slug: '' })).toEqual([
      'header',
      SITE_GLOBAL_TAG,
    ]);
    expect(revalidationTags({ collection: 'header', slug: null })).toEqual([
      'header',
      SITE_GLOBAL_TAG,
    ]);
  });
});
