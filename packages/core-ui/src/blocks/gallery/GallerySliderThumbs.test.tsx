import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GallerySliderThumbs } from './GallerySliderThumbs';

import type { GalleryData } from './gallery.types';

const imagen = {
  id: 1,
  filename: 'mobile-home.jpg',
  url: '/mobile-home.jpg',
  alt: 'Alt del archivo',
  mimeType: 'image/jpeg',
  filesize: 12345,
};

function bloqueCon(overrides: Partial<GalleryData> = {}): GalleryData {
  return {
    blockType: 'gallery',
    background: 'default',
    variant: 'slider-thumbs',
    images: [
      { image: imagen, alt: 'Vue 1' },
      { image: imagen, alt: 'Vue 2' },
      { image: imagen, alt: 'Vue 3' },
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

describe('GallerySliderThumbs', () => {
  it('pinta el carrusel principal y la barra de miniaturas', () => {
    render(<GallerySliderThumbs bloque={bloqueCon()} />);

    // Dos regiones de carrusel: la principal y la de miniaturas.
    expect(screen.getAllByRole('region')).toHaveLength(2);
    // Tres fotos en el principal + tres botones de miniatura.
    expect(screen.getAllByRole('button', { name: /aller à la photo \d/i })).toHaveLength(3);
  });

  it('marca la primera miniatura como activa de partida', () => {
    render(<GallerySliderThumbs bloque={bloqueCon()} />);

    const miniaturas = screen.getAllByRole('button', { name: /aller à la photo \d/i });
    expect(miniaturas[0]).toHaveAttribute('aria-current', 'true');
    expect(miniaturas[1]).toHaveAttribute('aria-current', 'false');
  });

  it('sin miniaturas cuando solo hay una imagen', () => {
    render(
      <GallerySliderThumbs bloque={bloqueCon({ images: [{ image: imagen, alt: 'Vue 1' }] })} />,
    );

    expect(screen.queryAllByRole('button', { name: /aller à la photo \d/i })).toHaveLength(0);
  });

  it('mueve el activo cuando el carrusel principal cambia de slide', async () => {
    render(<GallerySliderThumbs bloque={bloqueCon()} />);

    const [siguiente] = screen.getAllByRole('button', { name: /photo suivante|next slide/i });
    await act(async () => {
      siguiente.click();
    });

    const miniaturas = screen.getAllByRole('button', { name: /aller à la photo \d/i });
    expect(miniaturas[1]).toHaveAttribute('aria-current', 'true');
  });

  // No hay un test del sentido contrario —pulsar una miniatura navega el
  // carrusel principal— **a propósito**: el módulo Thumbs de Swiper no
  // navega con un `click` de DOM, escucha su propio evento `tap`, que emite
  // tras reconocer un gesto pointerdown+pointerup sin arrastre a través de
  // su propio tracking interno de coordenadas. jsdom no hace layout real
  // (`getBoundingClientRect` da todo a cero), así que ese reconocimiento de
  // gesto nunca ocurre y cualquier simulación se queda en verde sin probar
  // nada — el mismo tipo de falso positivo que ya costó un bug real en esta
  // historia (ver «Aprendizajes» en HU-011-gallery.md). Ese sentido está
  // cubierto de otras dos formas: `CarouselPrimitive.test.tsx` prueba que el
  // módulo Thumbs se activa con `thumbs={null}` —la causa raíz del bug—, y
  // se verificó a mano con Playwright en un Chromium real que pulsar las
  // miniaturas 3 y 5 navega el carrusel principal a esas fotos.

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<GallerySliderThumbs bloque={bloqueCon()} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('GallerySliderThumbs — medición tras montar (regresión de HU-011)', () => {
  it('mide sus slides tras montar, con y sin barra de miniaturas', async () => {
    // Ver el porqué en el test homónimo de GallerySlider. Aquí hacen falta
    // dos: el carrusel principal siempre tiene su propio `useEffect`, y con
    // una sola imagen la barra de miniaturas ni se monta — la vía por la que
    // antes se «autocuraba» por casualidad no existe en ese caso.
    let contenedor!: HTMLElement;
    await act(async () => {
      ({ container: contenedor } = render(<GallerySliderThumbs bloque={bloqueCon()} />));
    });

    const [principal] = contenedor.querySelectorAll<
      HTMLElement & { swiper?: { slidesGrid: number[] } }
    >('.swiper');

    await waitFor(() => expect(principal?.swiper?.slidesGrid).toHaveLength(3));
  });

  it('mide el carrusel principal con una sola imagen, sin barra de miniaturas', async () => {
    let contenedor!: HTMLElement;
    await act(async () => {
      ({ container: contenedor } = render(
        <GallerySliderThumbs bloque={bloqueCon({ images: [{ image: imagen, alt: 'Vue 1' }] })} />,
      ));
    });

    const principal = contenedor.querySelector<HTMLElement & { swiper?: { slidesGrid: number[] } }>(
      '.swiper',
    );

    await waitFor(() => expect(principal?.swiper?.slidesGrid).toHaveLength(1));
  });
});
