import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GalleryLightboxSlide } from './GalleryLightboxSlide';

const imagenPoblada = {
  id: 1,
  filename: 'piscine.png',
  url: '/piscine.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

describe('GalleryLightboxSlide', () => {
  it('no pinta nada si la referencia a media no trae url', () => {
    const { container } = render(
      <GalleryLightboxSlide item={{ image: 'media-1', alt: 'Piscine' }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta la imagen dentro del contenedor de zoom de Swiper', () => {
    const { container } = render(
      <GalleryLightboxSlide item={{ image: imagenPoblada, alt: 'Piscine climatisée' }} />,
    );

    const zoomContainer = container.querySelector('.swiper-zoom-container');
    expect(zoomContainer?.querySelector('img')).toHaveAttribute('alt', 'Piscine climatisée');
  });

  it('pinta figcaption cuando la imagen tiene caption', () => {
    render(
      <GalleryLightboxSlide
        item={{ image: imagenPoblada, alt: 'Piscine', caption: 'Ouverte de mai à septembre' }}
      />,
    );

    expect(screen.getByText('Ouverte de mai à septembre')).toBeInTheDocument();
  });

  it('no pinta figcaption sin caption', () => {
    const { container } = render(
      <GalleryLightboxSlide item={{ image: imagenPoblada, alt: 'Piscine' }} />,
    );

    expect(container.querySelector('figcaption')).toBeNull();
  });
});
