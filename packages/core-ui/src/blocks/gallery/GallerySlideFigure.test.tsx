import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GallerySlideFigure } from './GallerySlideFigure';
import { GalleryLightboxContext } from './gallery-lightbox-context';

const imagenPoblada = {
  id: 1,
  filename: 'piscine.png',
  url: '/piscine.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

describe('GallerySlideFigure', () => {
  it('no pinta nada si la referencia a media no trae url', () => {
    const { container } = render(
      <GallerySlideFigure item={{ image: 'media-1', alt: 'Piscine' }} indice={0} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta la imagen con el alt del bloque', () => {
    render(
      <GallerySlideFigure item={{ image: imagenPoblada, alt: 'Piscine climatisée' }} indice={0} />,
    );

    expect(screen.getByAltText('Piscine climatisée')).toBeInTheDocument();
  });

  it('pinta figcaption cuando la imagen tiene caption', () => {
    render(
      <GallerySlideFigure
        item={{ image: imagenPoblada, alt: 'Piscine', caption: 'Ouverte de mai à septembre' }}
        indice={0}
      />,
    );

    expect(screen.getByText('Ouverte de mai à septembre')).toBeInTheDocument();
  });

  it('no pinta figcaption sin caption', () => {
    const { container } = render(
      <GallerySlideFigure item={{ image: imagenPoblada, alt: 'Piscine' }} indice={0} />,
    );

    expect(container.querySelector('figcaption')).toBeNull();
  });
});

describe('GallerySlideFigure — lightbox', () => {
  it('sin proveedor de lightbox, no pinta el botón de ampliar', () => {
    const { container } = render(
      <GallerySlideFigure item={{ image: imagenPoblada, alt: 'Piscine' }} indice={3} />,
    );

    expect(container.querySelector('button')).toBeNull();
  });

  it('con proveedor, pulsar la slide abre el lightbox en su índice', () => {
    const abrir = vi.fn();

    render(
      <GalleryLightboxContext.Provider value={{ abrir }}>
        <GallerySlideFigure item={{ image: imagenPoblada, alt: 'Piscine' }} indice={3} />
      </GalleryLightboxContext.Provider>,
    );

    screen.getByRole('button', { name: 'Agrandir : Piscine' }).click();

    expect(abrir).toHaveBeenCalledWith(3);
  });
});
