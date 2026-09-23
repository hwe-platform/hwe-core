import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GallerySlider } from './GallerySlider';

import type { GalleryData } from './gallery.types';

const imagen = {
  id: 1,
  filename: 'piscine.png',
  url: '/piscine.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

function bloqueCon(overrides: Partial<GalleryData> = {}): GalleryData {
  return {
    blockType: 'gallery',
    background: 'default',
    variant: 'slider',
    images: [
      { image: imagen, alt: 'Piscine climatisée' },
      { image: imagen, alt: 'Terrasse couverte' },
      { image: imagen, alt: 'Espace jeux enfants' },
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
    ...overrides,
  };
}

describe('GallerySlider', () => {
  it('pinta una slide por imagen, dentro de una región de carrusel', () => {
    render(<GallerySlider bloque={bloqueCon()} />);

    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getAllByRole('group')).toHaveLength(3);
  });

  it('pinta flechas y puntos según la configuración del bloque', () => {
    render(<GallerySlider bloque={bloqueCon({ showArrows: true, showDots: true })} />);

    expect(screen.getByRole('button', { name: /photo suivante|next slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aller à la photo 1/i })).toBeInTheDocument();
  });

  it('sin flechas ni puntos, no los pinta', () => {
    render(<GallerySlider bloque={bloqueCon({ showArrows: false, showDots: false })} />);

    expect(screen.queryByRole('button', { name: /photo suivante|next slide/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /aller à la photo 1/i })).toBeNull();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<GallerySlider bloque={bloqueCon()} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });

  it('mide sus slides tras montar — regresión del carrusel en blanco de HU-011', async () => {
    // Cargado vía `next/dynamic` dentro de una página con SSR, Swiper puede
    // medir sus slides antes de que React las termine de montar: el carrusel
    // queda con `slidesGrid: []` y en blanco, con imágenes de verdad en el
    // DOM. `useEffect(() => swiper.update())` es lo que lo corrige. jsdom no
    // reproduce la carrera en sí —React Testing Library monta síncrono—, así
    // que este test fija la invariante que la corrección garantiza: al
    // terminar de montar, el número de huecos medidos coincide con el de
    // imágenes.
    let contenedor!: HTMLElement;
    await act(async () => {
      ({ container: contenedor } = render(<GallerySlider bloque={bloqueCon()} />));
    });

    const swiperEl = contenedor.querySelector<HTMLElement & { swiper?: { slidesGrid: number[] } }>(
      '.swiper',
    );

    expect(swiperEl?.swiper?.slidesGrid).toHaveLength(3);
  });
});
