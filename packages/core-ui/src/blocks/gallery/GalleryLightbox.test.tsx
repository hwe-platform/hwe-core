import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { GalleryLightbox } from './GalleryLightbox';

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
  { image: imagen, alt: 'Terrasse couverte', caption: 'Vue sur le jardin' },
  { image: imagen, alt: 'Espace jeux enfants' },
];

describe('GalleryLightbox', () => {
  it('es un diálogo modal con el patrón ARIA correcto', () => {
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={vi.fn()} />);

    const dialogo = screen.getByRole('dialog');
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
  });

  it('pinta una slide por imagen', () => {
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={vi.fn()} />);

    expect(screen.getAllByRole('group')).toHaveLength(3);
  });

  it('abre en la imagen pulsada, no siempre en la primera', () => {
    render(<GalleryLightbox images={imagenes} indiceInicial={1} onClose={vi.fn()} />);

    const grupos = screen.getAllByRole('group');
    expect(grupos[1]).toHaveClass('swiper-slide-active');
  });

  it('pinta la caption de la imagen que la lleva', () => {
    render(<GalleryLightbox images={imagenes} indiceInicial={1} onClose={vi.fn()} />);

    expect(screen.getByText('Vue sur le jardin')).toBeInTheDocument();
  });
});

describe('GalleryLightbox — cierre y foco', () => {
  it('cierra al pulsar el botón de cerrar', () => {
    const onClose = vi.fn();
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('cierra al pulsar el fondo, no al pulsar la imagen', () => {
    const onClose = vi.fn();
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={onClose} />);

    fireEvent.click(screen.getAllByRole('group')[0]);
    expect(onClose).not.toHaveBeenCalled();

    // El fondo real es el wrapper que envuelve el carrusel (`h-full
    // w-full`), no el `div[role=dialog]` exterior — ese no deja ningún
    // hueco propio, así que un clic ahí no ocurre nunca en un navegador
    // real. Se localiza como el padre del carrusel, no por rol: no lleva
    // ninguno propio, es solo el fondo.
    const fondo = screen.getByRole('dialog').querySelector(':scope > div:last-child');
    fireEvent.click(fondo as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('cierra con Escape', () => {
    const onClose = vi.fn();
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('bloquea el scroll del body mientras está abierto, y lo devuelve al desmontar', () => {
    const { unmount } = render(
      <GalleryLightbox images={imagenes} indiceInicial={0} onClose={vi.fn()} />,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('mueve el foco dentro del diálogo al abrirse', () => {
    render(<GalleryLightbox images={imagenes} indiceInicial={0} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });
});

describe('GalleryLightbox — accesibilidad', () => {
  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <GalleryLightbox images={imagenes} indiceInicial={0} onClose={vi.fn()} />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});
