import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GalleryLightboxProvider } from './GalleryLightboxProvider';
import { useGalleryLightbox } from './gallery-lightbox-context';

const imagen = {
  id: 1,
  filename: 'piscine.png',
  url: '/piscine.png',
  alt: 'Alt del archivo',
  mimeType: 'image/png',
  filesize: 12345,
};

const imagenes = [
  { image: imagen, alt: 'Piscine climatisée' },
  { image: imagen, alt: 'Terrasse couverte' },
];

/** Un consumidor mínimo del contexto, como lo serían GalleryFigure o GallerySlideFigure. */
function BotonDePrueba({ indice }: { indice: number }) {
  const abrir = useGalleryLightbox();
  return (
    <button type="button" onClick={() => abrir?.(indice)}>
      Agrandir {indice}
    </button>
  );
}

describe('GalleryLightboxProvider', () => {
  it('pinta a sus hijos', () => {
    render(
      <GalleryLightboxProvider images={imagenes}>
        <p>Contenido de la galería</p>
      </GalleryLightboxProvider>,
    );

    expect(screen.getByText('Contenido de la galería')).toBeInTheDocument();
  });

  it('sin abrir nada, no monta el visor', () => {
    render(
      <GalleryLightboxProvider images={imagenes}>
        <BotonDePrueba indice={0} />
      </GalleryLightboxProvider>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('abre el visor en la imagen pulsada — carga bajo demanda, así que espera', async () => {
    render(
      <GalleryLightboxProvider images={imagenes}>
        <BotonDePrueba indice={1} />
      </GalleryLightboxProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agrandir 1' }));

    const dialogo = await screen.findByRole('dialog');
    const grupos = screen.getAllByRole('group');
    expect(grupos[1]).toHaveClass('swiper-slide-active');
    expect(dialogo).toBeInTheDocument();
  });

  it('cierra el visor y limpia el estado', async () => {
    render(
      <GalleryLightboxProvider images={imagenes}>
        <BotonDePrueba indice={0} />
      </GalleryLightboxProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agrandir 0' }));
    await screen.findByRole('dialog');

    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
