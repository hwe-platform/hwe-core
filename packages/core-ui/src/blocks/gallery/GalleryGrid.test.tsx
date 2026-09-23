import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { GalleryGrid } from './GalleryGrid';

import type { GalleryData } from './gallery.types';

/**
 * El mock global de `next/image` (`vitest.setup.tsx`) esparce `priority` tal
 * cual sobre un `<img>` nativo, y React descarta un atributo desconocido con
 * valor booleano en vez de escribirlo — `hasAttribute('priority')` da
 * siempre `false`. Se sustituye aquí, solo en este fichero, por una versión
 * que sí deja rastro de `priority` en el DOM.
 */
vi.mock('next/image', () => ({
  default: ({ alt, fill: _fill, priority, ...props }: Record<string, unknown>) => (
    <img alt={alt as string} data-priority={priority ? 'true' : undefined} {...props} />
  ),
}));

const imagen = {
  id: 1,
  filename: 'piscine.png',
  url: '/piscine.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

const bloque: GalleryData = {
  blockType: 'gallery',
  background: 'default',
  variant: 'grid',
  images: [
    { image: imagen, alt: 'Piscine climatisée' },
    { image: imagen, alt: 'Terrasse couverte' },
    { image: imagen, alt: 'Espace jeux enfants' },
    { image: imagen, alt: 'Aire de jeux' },
  ],
  columns: 3,
  aspectRatio: '16/9',
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

describe('GalleryGrid', () => {
  it('pinta una figura por imagen', () => {
    const { container } = render(<GalleryGrid bloque={bloque} />);

    expect(container.querySelectorAll('figure')).toHaveLength(4);
  });

  it('da prioridad a las imágenes de la primera fila', () => {
    render(<GalleryGrid bloque={bloque} />);

    const imagenes = screen.getAllByRole('img');
    // Con columns: 3, las tres primeras son la primera fila.
    expect(imagenes[0]).toHaveAttribute('data-priority', 'true');
    expect(imagenes[2]).toHaveAttribute('data-priority', 'true');
    expect(imagenes[3]).not.toHaveAttribute('data-priority');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<GalleryGrid bloque={bloque} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });
});
