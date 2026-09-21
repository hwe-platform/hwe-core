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

  it('aplica los valores por defecto de los ejes de media-text', () => {
    const result = pageBlockSchema.parse(mediaTextBlock());

    expect(result).toMatchObject({ media: 'image', split: 6, reverse: false, align: 'center' });
  });
});

// Un mapa de Google, que es lo que el diseño incrusta y uno de los pocos
// dominios que la lista admite.
const MAPA = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891';

describe('pageBlockSchema — ejes de media-text', () => {
  // El reparto es un número, no una enumeración de los repartos que usa el
  // primer cliente: La Civelle ya emplea 5, 6 y 7.
  it('acepta cualquier reparto de columnas entre 1 y 11', () => {
    for (const split of [1, 5, 6, 7, 11]) {
      expect(pageBlockSchema.safeParse(mediaTextBlock({ split })).success).toBe(true);
    }
    expect(pageBlockSchema.safeParse(mediaTextBlock({ split: 12 })).success).toBe(false);
    expect(pageBlockSchema.safeParse(mediaTextBlock({ split: 5.5 })).success).toBe(false);
  });

  it('exige el campo que corresponde a cada tipo de medio', () => {
    expect(pageBlockSchema.safeParse(mediaTextBlock({ media: 'carousel' })).success).toBe(false);
    expect(pageBlockSchema.safeParse(mediaTextBlock({ media: 'embed' })).success).toBe(false);

    const carrusel = mediaTextBlock({ media: 'carousel', images: ['media-1', 'media-2'] });
    expect(pageBlockSchema.safeParse(carrusel).success).toBe(true);

    const embed = mediaTextBlock({ media: 'embed', embedUrl: MAPA });
    expect(pageBlockSchema.safeParse(embed).success).toBe(true);
  });
});

describe('pageBlockSchema — media-text: barreras y detalle', () => {
  it('solo admite incrustar https de los dominios de la lista', () => {
    // El `<iframe>` pinta lo que le den bajo el dominio del cliente, y no hay
    // CSP que lo ataje: la lista es hoy el único filtro. Un `data:text/html`
    // llevaría el script dentro del propio registro del CMS.
    const rechazados = [
      'https://evil.example/x',
      'http://www.google.com/maps/embed?pb=1',
      'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      'javascript:alert(1)',
      'no-es-una-url',
    ];

    for (const embedUrl of rechazados) {
      expect(pageBlockSchema.safeParse(mediaTextBlock({ media: 'embed', embedUrl })).success).toBe(
        false,
      );
    }
  });

  it('la línea del antetítulo es un eje, y por defecto no está', () => {
    expect(pageBlockSchema.parse(mediaTextBlock({}))).toHaveProperty('eyebrowRule', false);
    expect(pageBlockSchema.parse(mediaTextBlock({ eyebrowRule: true }))).toHaveProperty(
      'eyebrowRule',
      true,
    );
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
