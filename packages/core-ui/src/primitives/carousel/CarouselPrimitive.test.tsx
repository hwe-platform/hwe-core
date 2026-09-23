import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { CarouselPrimitive, CarouselSlide } from './CarouselPrimitive';

import type { ReactNode } from 'react';
import type { CarouselInstance } from './carousel-primitive.types';

/** Sustituye `matchMedia`, que jsdom no implementa, con una preferencia fija. */
function simularPreferencia(reducido: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: reducido,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

/** Tres slides con texto reconocible, que es lo que casi todo test necesita. */
function slides(): ReactNode {
  return ['uno', 'dos', 'tres'].map((texto) => (
    <CarouselSlide key={texto}>
      <p>{texto}</p>
    </CarouselSlide>
  ));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CarouselPrimitive', () => {
  it('pinta todas las slides que recibe', () => {
    render(<CarouselPrimitive>{slides()}</CarouselPrimitive>);

    expect(screen.getByText('uno')).toBeInTheDocument();
    expect(screen.getByText('dos')).toBeInTheDocument();
    expect(screen.getByText('tres')).toBeInTheDocument();
  });
});

describe('CarouselPrimitive — patrón ARIA de carrusel', () => {
  it('marca el contenedor como región de carrusel con nombre accesible', () => {
    render(
      <CarouselPrimitive labels={{ region: 'Galerie du camping' }}>{slides()}</CarouselPrimitive>,
    );

    const region = screen.getByRole('region');

    expect(region).toHaveAttribute('aria-label', 'Galerie du camping');
    expect(region).toHaveAttribute('aria-roledescription', 'carrousel');
  });

  it('etiqueta cada slide con su posición y el total', () => {
    render(<CarouselPrimitive>{slides()}</CarouselPrimitive>);

    const grupos = screen.getAllByRole('group');

    expect(grupos).toHaveLength(3);
    expect(grupos[0]).toHaveAttribute('aria-label', 'Photo 1 sur 3');
    expect(grupos[2]).toHaveAttribute('aria-label', 'Photo 3 sur 3');
    expect(grupos[0]).toHaveAttribute('aria-roledescription', 'diapositive');
  });

  it('traduce los rótulos del patrón cuando se los pasan', () => {
    render(
      <CarouselPrimitive labels={{ slide: 'Imagen {{index}} de {{slidesLength}}' }}>
        {slides()}
      </CarouselPrimitive>,
    );

    expect(screen.getAllByRole('group')[0]).toHaveAttribute('aria-label', 'Imagen 1 de 3');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <CarouselPrimitive navigation pagination>
        {slides()}
      </CarouselPrimitive>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CarouselPrimitive — controles', () => {
  it('no pinta flechas ni puntos si nadie los pide', () => {
    render(<CarouselPrimitive>{slides()}</CarouselPrimitive>);

    expect(screen.queryByRole('button', { name: 'Photo suivante' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aller à la photo 1' })).not.toBeInTheDocument();
  });

  it('pinta las flechas cuando se piden', () => {
    render(<CarouselPrimitive navigation>{slides()}</CarouselPrimitive>);

    expect(screen.getByRole('button', { name: 'Photo précédente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Photo suivante' })).toBeInTheDocument();
  });

  it('pinta un punto de paginación por slide cuando se piden', () => {
    render(<CarouselPrimitive pagination>{slides()}</CarouselPrimitive>);

    expect(screen.getByRole('button', { name: 'Aller à la photo 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aller à la photo 3' })).toBeInTheDocument();
  });
});

describe('CarouselPrimitive — movimiento', () => {
  it('activa el autoplay con el retardo pedido', () => {
    let instancia: CarouselInstance | undefined;

    render(
      <CarouselPrimitive
        autoplay
        autoplayDelay={5000}
        onSwiper={(swiper) => {
          instancia = swiper;
        }}
      >
        {slides()}
      </CarouselPrimitive>,
    );

    expect(instancia?.params.autoplay).toMatchObject({ enabled: true, delay: 5000 });
  });

  it('desactiva el autoplay y la transición si el sistema pide movimiento reducido', () => {
    simularPreferencia(true);
    let instancia: CarouselInstance | undefined;

    render(
      <CarouselPrimitive
        autoplay
        onSwiper={(swiper) => {
          instancia = swiper;
        }}
      >
        {slides()}
      </CarouselPrimitive>,
    );

    // La preferencia gana a la configuración del bloque: ni módulo ni opción.
    expect(instancia?.params.autoplay?.enabled).not.toBe(true);
    expect(instancia?.params.speed).toBe(0);
  });
});

describe('CarouselPrimitive — valores por defecto', () => {
  it('mantiene los valores por defecto cuando el llamante pasa undefined', () => {
    // Es exactamente lo que hará GalleryBlock con los campos que el editor no
    // haya tocado: `loop={bloque.loop}` con el campo sin rellenar.
    let instancia: CarouselInstance | undefined;

    render(
      <CarouselPrimitive
        loop={undefined}
        navigation={undefined}
        thumbs={undefined}
        onSwiper={(swiper) => {
          instancia = swiper;
        }}
      >
        {slides()}
      </CarouselPrimitive>,
    );

    expect(instancia?.params.loop).toBe(true);
    expect(screen.queryByRole('button', { name: 'Photo suivante' })).not.toBeInTheDocument();
    // `thumbs: undefined` no puede colar el módulo Thumbs sin miniaturas.
    expect(instancia?.params.thumbs?.swiper).toBeUndefined();
  });
});

describe('CarouselPrimitive — eventos', () => {
  it('avisa del cambio de slide con el índice real', () => {
    const alCambiar = vi.fn();
    let instancia: CarouselInstance | undefined;

    render(
      <CarouselPrimitive
        onSlideChange={alCambiar}
        onSwiper={(swiper) => {
          instancia = swiper;
        }}
      >
        {slides()}
      </CarouselPrimitive>,
    );

    act(() => {
      instancia?.slideNext(0);
    });

    expect(alCambiar).toHaveBeenCalledWith(1);
  });
});
