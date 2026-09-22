import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { BlogBlock } from './BlogBlock';

const imagen = {
  id: 1,
  filename: 'saison.png',
  url: '/saison.png',
  alt: 'Camping en été',
  mimeType: 'image/png',
  filesize: 12345,
};

/** Artículos ya resueltos, que es como le llegan al bloque. */
const items = [
  {
    image: imagen,
    title: 'Nouvelle saison 2026',
    subtitle: 'Toutes les nouveautés du camping',
    tag: 'Camping',
    url: '/blog/nouvelle-saison-2026',
    date: '15 mars 2026',
    readMoreLabel: "Lire l'article",
  },
  {
    image: imagen,
    title: 'Surf à Capbreton',
    tag: 'Tourisme',
    url: '/blog/surf-capbreton',
    date: '10 mars 2026',
  },
];

const base = {
  blockType: 'blog' as const,
  source: 'latest' as const,
  limit: 3,
  items,
};

afterEach(() => vi.restoreAllMocks());

describe('BlogBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<BlogBlock data={{ blockType: 'otro' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta una tarjeta por artículo resuelto, con su fecha y su categoría', () => {
    const { container } = render(<BlogBlock data={base} />);

    expect(screen.getByText('Nouvelle saison 2026')).toBeTruthy();
    expect(screen.getByText('15 mars 2026')).toBeTruthy();
    expect(screen.getByText('Camping')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('sin artículos no pinta la sección', () => {
    // Un listado vacío no es una sección vacía: es una sección que sobra.
    const { container } = render(<BlogBlock data={{ ...base, items: [] }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('un bloque sin resolver es válido y no rompe la página', () => {
    // El editor lo crea vacío y el site lo rellena después; entre medias no
    // puede tumbar nada.
    const { container } = render(<BlogBlock data={{ blockType: 'blog' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <BlogBlock data={{ ...base, subtitle: 'Blog', title: 'Actualités' }} />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('BlogBlock — enlace al listado', () => {
  it('no aparece si no está pedido', () => {
    const { container } = render(<BlogBlock data={base} />);

    expect(container.querySelector('a[href="/actualites"]')).toBeNull();
  });

  it('aparece cuando hay destino, y va sin fondo como en el diseño', () => {
    const { container } = render(
      <BlogBlock
        data={{
          ...base,
          showMoreLink: true,
          showMoreUrl: '/actualites',
          showMoreLabel: 'Voir toutes les actualités',
        }}
      />,
    );

    const enlace = container.querySelector('a[href="/actualites"]');
    expect(enlace).toBeTruthy();
    expect(enlace?.className).not.toContain('bg-primary');
    expect(screen.getByText('Voir toutes les actualités')).toBeTruthy();
  });

  it('pedido pero sin destino no se pinta, en vez de un enlace a ninguna parte', () => {
    const { container } = render(<BlogBlock data={{ ...base, showMoreLink: true }} />);

    expect(container.querySelectorAll('a')).toHaveLength(1);
  });
});
