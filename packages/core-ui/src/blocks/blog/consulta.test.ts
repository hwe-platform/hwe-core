import { describe, it, expect } from 'vitest';

import { consultaDeBlog, articuloATarjeta } from './consulta';

import type { BlogData } from './blog.types';

/** Un bloque válido mínimo; cada test cambia solo lo que comprueba. */
const base = {
  blockType: 'blog',
  source: 'latest',
  limit: 3,
  showMoreLink: false,
  background: 'default',
  items: [],
} as unknown as BlogData;

describe('consultaDeBlog', () => {
  it('los últimos van por fecha descendente, sin filtro', () => {
    expect(consultaDeBlog(base)).toEqual({ sort: '-publishedAt', limit: 3 });
  });

  it('los destacados se filtran por su casilla', () => {
    expect(consultaDeBlog({ ...base, source: 'featured' })).toEqual({
      sort: '-publishedAt',
      limit: 3,
      where: { featured: { equals: true } },
    });
  });

  it('por categoría filtra por la que diga el bloque', () => {
    expect(consultaDeBlog({ ...base, source: 'byCategory', category: 'Gastronomie' })).toEqual({
      sort: '-publishedAt',
      limit: 3,
      where: { category: { equals: 'Gastronomie' } },
    });
  });

  it('por categoría sin categoría enseña los últimos, no una sección vacía', () => {
    // Un bloque a medio configurar tiene que seguir enseñando algo: el editor
    // lo lee como «todavía no he elegido», no como «no hay artículos».
    expect(consultaDeBlog({ ...base, source: 'byCategory' })).toEqual({
      sort: '-publishedAt',
      limit: 3,
    });
  });

  it('el límite sale del bloque', () => {
    expect(consultaDeBlog({ ...base, limit: 6 }).limit).toBe(6);
  });
});

/** Un artículo como el que devuelve la colección. */
const articulo = {
  title: 'Nouvelle saison 2026',
  slug: 'nouvelle-saison-2026',
  excerpt: 'Toutes les nouveautés du camping',
  category: 'Camping',
  publishedAt: '2026-03-15T00:00:00.000Z',
  image: {
    id: 1,
    filename: 'a.png',
    url: '/a.png',
    alt: 'Foto',
    mimeType: 'image/png',
    filesize: 1,
  },
};

describe('articuloATarjeta', () => {
  it('mapea el artículo a la forma de tarjeta que pinta card-grid', () => {
    const tarjeta = articuloATarjeta(articulo, { locale: 'fr', readMoreLabel: "Lire l'article" });

    expect(tarjeta).toMatchObject({
      title: 'Nouvelle saison 2026',
      tag: 'Camping',
      url: '/blog/nouvelle-saison-2026',
      readMoreLabel: "Lire l'article",
      variant: 'link',
    });
  });

  it('sin pedirlo, la tarjeta no lleva resumen', () => {
    // La tarjeta del diseño de referencia es píldora, fecha, titular y enlace.
    // Un párrafo que nadie ha pedido es contenido inventado en la página.
    expect(articuloATarjeta(articulo, { locale: 'fr' }).subtitle).toBeUndefined();
  });

  it('con `showExcerpt` el resumen va de subtítulo', () => {
    const tarjeta = articuloATarjeta(articulo, { locale: 'fr', showExcerpt: true });

    expect(tarjeta.subtitle).toBe('Toutes les nouveautés du camping');
  });

  it('formatea la fecha en el idioma de la página', () => {
    const fr = articuloATarjeta(articulo, { locale: 'fr' }).date;
    const en = articuloATarjeta(articulo, { locale: 'en' }).date;

    expect(fr).toContain('mars');
    expect(en).toContain('March');
  });

  it('una fecha ilegible deja la tarjeta sin fecha, no con «Invalid Date»', () => {
    expect(articuloATarjeta({ ...articulo, publishedAt: 'ayer' }, { locale: 'fr' }).date).toBe(
      undefined,
    );
    expect(articuloATarjeta({ ...articulo, publishedAt: undefined }, { locale: 'fr' }).date).toBe(
      undefined,
    );
  });

  it('el prefijo de la URL se puede cambiar', () => {
    expect(articuloATarjeta(articulo, { locale: 'fr', basePath: '/actualites' }).url).toBe(
      '/actualites/nouvelle-saison-2026',
    );
  });
});
