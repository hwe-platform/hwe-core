import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { GalleryBlock } from './GalleryBlock';

/** Una referencia de media poblada, como la que devuelve Payload con `depth`. */
const imagen = {
  id: 1,
  filename: 'terrasse.png',
  url: '/terrasse.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

/** Un bloque válido mínimo; cada test cambia solo el eje que comprueba. */
const base = {
  blockType: 'gallery' as const,
  variant: 'grid' as const,
  images: [
    { image: imagen, alt: 'Terrasse du mobile home' },
    { image: imagen, alt: 'Piscine climatisée' },
  ],
};

afterEach(() => vi.restoreAllMocks());

describe('GalleryBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<GalleryBlock data={{ blockType: 'otro' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('no pinta nada sin imágenes', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<GalleryBlock data={{ ...base, images: [] }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta las imágenes en una sección', () => {
    const { container } = render(<GalleryBlock data={base} />);

    expect(container.querySelector('section')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <GalleryBlock data={{ ...base, title: 'Découvrez nos hébergements' }} />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('GalleryBlock — variantes', () => {
  it('resuelve grid, masonry y collage por mapa', () => {
    const { container: g } = render(<GalleryBlock data={{ ...base, variant: 'grid' }} />);
    expect(g.querySelector('section')?.className).not.toContain('columns-');

    const { container: m } = render(<GalleryBlock data={{ ...base, variant: 'masonry' }} />);
    expect(m.querySelector('[class*="columns-"]')).toBeTruthy();

    const { container: c } = render(<GalleryBlock data={{ ...base, variant: 'collage' }} />);
    expect(c.querySelector('.row-span-2')).toBeTruthy();
  });

  it('resuelve slider y slider-thumbs, cargados bajo demanda', async () => {
    // `next/dynamic` resuelve el import() de forma asíncrona incluso en test
    // — la sección existe desde el primer render, el carrusel llega después.
    const { container: s } = render(<GalleryBlock data={{ ...base, variant: 'slider' }} />);
    expect(s.querySelector('section')).toBeTruthy();
    expect(await screen.findByRole('region')).toBeInTheDocument();

    const { container: st } = render(<GalleryBlock data={{ ...base, variant: 'slider-thumbs' }} />);
    expect(st.querySelector('section')).toBeTruthy();
    await screen.findAllByRole('region');
  });
});

describe('GalleryBlock — sección', () => {
  it('pinta el título al nivel de titular configurado', () => {
    const { container } = render(
      <GalleryBlock data={{ ...base, title: 'Notre galerie', headingLevel: '3' }} />,
    );

    expect(container.querySelector('h3')).toHaveTextContent('Notre galerie');
    expect(container.querySelector('h2')).toBeNull();
  });

  it('pinta la descripción bajo el título', () => {
    render(
      <GalleryBlock
        data={{ ...base, title: 'Notre galerie', description: 'Un aperçu du camping.' }}
      />,
    );

    expect(screen.getByText('Un aperçu du camping.')).toBeInTheDocument();
  });

  it('pinta los ctas cuando el bloque los trae', () => {
    render(
      <GalleryBlock
        data={{ ...base, ctas: [{ label: 'Voir plus', url: '/galerie', variant: 'primary' }] }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Voir plus' })).toHaveAttribute('href', '/galerie');
  });
});

describe('GalleryBlock — lightbox', () => {
  it('con lightbox activado (el default), pulsar una imagen abre el visor en su índice', async () => {
    render(<GalleryBlock data={base} />);

    fireEvent.click(screen.getAllByRole('button', { name: /Agrandir/ })[1]);

    await screen.findByRole('dialog');
    // Dos regiones de carrusel: la galería y el visor. Las slides del visor
    // llevan la marca de activa de Swiper en la que se pulsó, la índice 1.
    const grupos = screen.getAllByRole('group');
    const grupoActivo = grupos.find((g) => g.className.includes('swiper-slide-active'));
    expect(grupoActivo).toHaveAttribute('aria-label', expect.stringContaining('2 sur'));
  });

  it('con lightbox: false, las imágenes no se envuelven en botón', () => {
    const { container } = render(<GalleryBlock data={{ ...base, lightbox: false }} />);

    expect(container.querySelector('button[aria-label^="Agrandir"]')).toBeNull();
  });
});
