import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { GalleryCollage } from './GalleryCollage';

import type { GalleryData } from './gallery.types';

/** Ver el mismo mock y su motivo en `GalleryGrid.test.tsx`. */
vi.mock('next/image', () => ({
  default: ({ alt, fill: _fill, priority, ...props }: Record<string, unknown>) => (
    <img alt={alt as string} data-priority={priority ? 'true' : undefined} {...props} />
  ),
}));

const imagen = {
  id: 1,
  filename: 'cottage.png',
  url: '/cottage.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

function bloqueCon(images: GalleryData['images']): GalleryData {
  return {
    blockType: 'gallery',
    background: 'default',
    variant: 'collage',
    images,
    columns: 3,
    aspectRatio: '4/3',
    lightbox: true,
    autoplay: false,
    autoplayDelay: 3000,
    loop: true,
    showDots: true,
    showArrows: true,
    effect: 'slide',
    slidesPerView: 1,
    headingLevel: '2',
    ctas: [],
  };
}

const bloque = bloqueCon([
  { image: imagen, alt: 'Cottage vue extérieure' },
  { image: imagen, alt: 'Chambre principale' },
  { image: imagen, alt: 'Cuisine équipée' },
]);

describe('GalleryCollage', () => {
  it('pinta una figura por imagen, la primera como destacada', () => {
    const { container } = render(<GalleryCollage bloque={bloque} />);

    expect(container.querySelectorAll('figure')).toHaveLength(3);
    expect(container.querySelector('figure')).toHaveClass('col-span-2', 'row-span-2');
  });

  it('da prioridad solo a la imagen destacada', () => {
    render(<GalleryCollage bloque={bloque} />);

    const imagenes = screen.getAllByRole('img');
    expect(imagenes[0]).toHaveAttribute('data-priority', 'true');
    expect(imagenes[1]).not.toHaveAttribute('data-priority');
  });

  it('no pinta nada sin imágenes', () => {
    const { container } = render(<GalleryCollage bloque={bloqueCon([])} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<GalleryCollage bloque={bloque} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });
});
