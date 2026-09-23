import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GalleryMasonry } from './GalleryMasonry';

import type { GalleryData } from './gallery.types';

const imagen = {
  id: 1,
  filename: 'entorno.png',
  url: '/entorno.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
  width: 1200,
  height: 800,
};

const bloque: GalleryData = {
  blockType: 'gallery',
  background: 'default',
  variant: 'masonry',
  images: [
    { image: imagen, alt: 'Forêt de pins' },
    { image: imagen, alt: 'Plage de Capbreton' },
  ],
  columns: 3,
  // A propósito distinto de 'auto': masonry debe ignorarlo igualmente.
  aspectRatio: '1/1',
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

describe('GalleryMasonry', () => {
  it('pinta una figura por imagen', () => {
    const { container } = render(<GalleryMasonry bloque={bloque} />);

    expect(container.querySelectorAll('figure')).toHaveLength(2);
  });

  it('ignora el aspectRatio configurado y usa las dimensiones reales', () => {
    render(<GalleryMasonry bloque={bloque} />);

    const [primera] = screen.getAllByRole('img');
    // Si respetara `aspectRatio: '1/1'`, no llevaría width/height propios —
    // los pondría el contenedor con `aspect-square`, no la imagen.
    expect(primera).toHaveAttribute('width', '1200');
    expect(primera).toHaveAttribute('height', '800');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<GalleryMasonry bloque={bloque} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });
});
