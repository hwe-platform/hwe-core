import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GalleryFigure } from './GalleryFigure';
import { GalleryLightboxContext } from './gallery-lightbox-context';

/** Una referencia de media poblada, como la que devuelve Payload con `depth`. */
const imagenPoblada = {
  id: 1,
  filename: 'terrasse.png',
  url: '/terrasse.png',
  alt: 'Alt genérico del archivo',
  mimeType: 'image/png',
  filesize: 12345,
  width: 1600,
  height: 900,
};

describe('GalleryFigure', () => {
  it('no pinta nada si la referencia a media no trae url', () => {
    const { container } = render(
      <GalleryFigure item={{ image: 'media-1', alt: 'Terrasse' }} indice={0} aspectRatio="16/9" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta la imagen con el alt del bloque', () => {
    render(
      <GalleryFigure
        item={{ image: imagenPoblada, alt: 'Terrasse du mobile home Confort' }}
        indice={0}
        aspectRatio="16/9"
      />,
    );

    expect(screen.getByAltText('Terrasse du mobile home Confort')).toBeInTheDocument();
  });

  it('cae al alt de media si el del bloque llega vacío', () => {
    render(
      <GalleryFigure item={{ image: imagenPoblada, alt: '' }} indice={0} aspectRatio="16/9" />,
    );

    expect(screen.getByAltText('Alt genérico del archivo')).toBeInTheDocument();
  });

  it('pinta figcaption cuando la imagen tiene caption', () => {
    render(
      <GalleryFigure
        item={{ image: imagenPoblada, alt: 'Piscine', caption: 'Piscine climatisée' }}
        indice={0}
        aspectRatio="16/9"
      />,
    );

    expect(screen.getByText('Piscine climatisée')).toBeInTheDocument();
  });

  it('no pinta figcaption sin caption', () => {
    const { container } = render(
      <GalleryFigure
        item={{ image: imagenPoblada, alt: 'Piscine' }}
        indice={0}
        aspectRatio="16/9"
      />,
    );

    expect(container.querySelector('figcaption')).toBeNull();
  });
});

describe('GalleryFigure — aspectRatio auto', () => {
  it('con aspectRatio auto y media poblada, usa las dimensiones reales', () => {
    render(
      <GalleryFigure
        item={{ image: imagenPoblada, alt: 'Piscine' }}
        indice={0}
        aspectRatio="auto"
      />,
    );

    const img = screen.getByAltText('Piscine');
    expect(img).toHaveAttribute('width', '1600');
    expect(img).toHaveAttribute('height', '900');
  });

  it('con aspectRatio auto y media poblada sin dimensiones, cae al recorte con fill', () => {
    // Payload puede poblar el documento sin `width`/`height` resueltos aún —
    // sin este respaldo, `auto` no tendría cómo reservar el hueco de la imagen.
    const sinDimensiones = { ...imagenPoblada, width: undefined, height: undefined };

    render(
      <GalleryFigure
        item={{ image: sinDimensiones, alt: 'Piscine' }}
        indice={0}
        aspectRatio="auto"
      />,
    );

    const img = screen.getByAltText('Piscine');
    expect(img).not.toHaveAttribute('width');
  });
});

describe('GalleryFigure — lightbox', () => {
  it('sin proveedor de lightbox, no envuelve la imagen en botón', () => {
    const { container } = render(
      <GalleryFigure
        item={{ image: imagenPoblada, alt: 'Piscine' }}
        indice={2}
        aspectRatio="16/9"
      />,
    );

    expect(container.querySelector('button')).toBeNull();
  });

  it('con proveedor, pulsar la imagen abre el lightbox en su índice', () => {
    const abrir = vi.fn();

    render(
      <GalleryLightboxContext.Provider value={{ abrir }}>
        <GalleryFigure
          item={{ image: imagenPoblada, alt: 'Piscine' }}
          indice={2}
          aspectRatio="16/9"
        />
      </GalleryLightboxContext.Provider>,
    );

    screen.getByRole('button', { name: 'Agrandir : Piscine' }).click();

    expect(abrir).toHaveBeenCalledWith(2);
  });
});
