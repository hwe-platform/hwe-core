import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { CardGridBlock } from './CardGridBlock';

/** Una referencia de media poblada, como la que devuelve Payload con `depth`. */
const imagen = {
  id: 1,
  filename: 'capbreton.png',
  url: '/capbreton.png',
  alt: 'Port de Capbreton',
  mimeType: 'image/png',
  filesize: 12345,
};

/** Un bloque válido mínimo; cada test cambia solo el eje que comprueba. */
const base = {
  blockType: 'card-grid' as const,
  card: 'stacked' as const,
  columns: 3,
  items: [
    { image: imagen, title: 'Capbreton', tag: 'Village & port' },
    { image: imagen, title: 'Surf & Plages', tag: 'Atlantique' },
  ],
};

afterEach(() => vi.restoreAllMocks());

describe('CardGridBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<CardGridBlock data={{ blockType: 'otro' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta una tarjeta por item, con su imagen y su etiqueta', () => {
    const { container } = render(<CardGridBlock data={base} />);

    expect(screen.getByText('Capbreton')).toBeTruthy();
    expect(screen.getByText('Village & port')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('una rejilla sin items no revienta', () => {
    const { container } = render(<CardGridBlock data={{ ...base, items: [] }} />);

    expect(container.querySelector('section')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <CardGridBlock data={{ ...base, subtitle: 'La región', title: 'Découvrez les alentours' }} />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('CardGridBlock — anatomía de la tarjeta', () => {
  it('stacked pone la imagen arriba y el texto debajo, en flujo normal', () => {
    const { container } = render(<CardGridBlock data={base} />);

    expect(container.querySelector('.bg-card.rounded-2xl')).toBeTruthy();
    expect(container.querySelector('.bg-gradient-to-t')).toBeNull();
  });

  it('overlay pone el texto sobre la imagen, con su degradado', () => {
    const { container } = render(<CardGridBlock data={{ ...base, card: 'overlay' }} />);

    expect(container.querySelector('.bg-gradient-to-t')).toBeTruthy();
    expect(container.querySelector('.absolute.bottom-0')).toBeTruthy();
  });

  it('el enlace de la tarjeta solo aparece con destino y texto', () => {
    const { container: sinEnlace } = render(<CardGridBlock data={base} />);
    const { container: conEnlace } = render(
      <CardGridBlock
        data={{
          ...base,
          items: [
            { image: imagen, title: 'Capbreton', url: '/capbreton', readMoreLabel: 'Découvrir' },
          ],
        }}
      />,
    );

    expect(sinEnlace.querySelector('a')).toBeNull();
    expect(conEnlace.querySelector('a')?.getAttribute('href')).toBe('/capbreton');
    expect(screen.getByText('Découvrir')).toBeTruthy();
  });

  it('la fecha y el subtítulo se pintan solo si llegan — es lo que permite reusar la tarjeta en blog', () => {
    render(
      <CardGridBlock
        data={{
          ...base,
          items: [
            {
              image: imagen,
              title: 'Nouvelle saison 2026',
              tag: 'Camping',
              date: '15 Mars 2026',
              subtitle: 'Toutes les nouveautés',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('15 Mars 2026')).toBeTruthy();
    expect(screen.getByText('Toutes les nouveautés')).toBeTruthy();
  });
});

describe('CardStacked — piezas opcionales', () => {
  it('sin imagen no deja el marco vacío, y la fecha puede ir sin etiqueta', () => {
    const { container } = render(
      <CardGridBlock
        data={{
          ...base,
          items: [
            { image: { ...imagen, url: undefined }, title: 'Gâteau basque', date: '5 Mars 2026' },
          ],
        }}
      />,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('5 Mars 2026')).toBeTruthy();
    expect(screen.getByText('Gâteau basque')).toBeTruthy();
  });
});

describe('CardOverlay — piezas opcionales', () => {
  it('pinta etiqueta, subtítulo y enlace cuando llegan los tres', () => {
    const { container } = render(
      <CardGridBlock
        data={{
          ...base,
          card: 'overlay',
          items: [
            {
              image: imagen,
              title: 'Nos Locations',
              tag: 'Hébergements',
              subtitle: 'Mobile Home Confort 3 ch',
              url: '/locations',
              readMoreLabel: 'Découvrir',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Hébergements')).toBeTruthy();
    expect(screen.getByText('Mobile Home Confort 3 ch')).toBeTruthy();
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/locations');
  });

  it('sin imagen sigue pintando el texto, no un hueco', () => {
    // Una tarjeta puede quedarse sin foto si el editor la borra de la
    // biblioteca; el degradado y el texto tienen que aguantar.
    const { container } = render(
      <CardGridBlock
        data={{
          ...base,
          card: 'overlay',
          items: [{ image: { ...imagen, url: undefined }, title: 'Capbreton' }],
        }}
      />,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Capbreton')).toBeTruthy();
  });
});

describe('CardGridBlock — reparto', () => {
  it('el número de columnas llega a la clase de retícula', () => {
    const { container } = render(<CardGridBlock data={{ ...base, columns: 4 }} />);

    expect(container.querySelector('.lg\\:grid-cols-4')).toBeTruthy();
  });

  it('un reparto asimétrico pasa la rejilla a doce columnas y reparte por tarjeta', () => {
    // «Nos Hébergements»: dos tarjetas a 5 y 7 de doce.
    const { container } = render(<CardGridBlock data={{ ...base, spans: [5, 7] }} />);

    expect(container.querySelector('.lg\\:grid-cols-12')).toBeTruthy();
    expect(container.querySelector('.lg\\:col-span-5')).toBeTruthy();
    expect(container.querySelector('.lg\\:col-span-7')).toBeTruthy();
  });

  it('el reparto se recorre en ciclo, así que dos valores visten cuatro tarjetas', () => {
    const cuatro = [0, 1, 2, 3].map((i) => ({ image: imagen, title: `Tarjeta ${i}` }));
    const { container } = render(
      <CardGridBlock data={{ ...base, items: cuatro, spans: [5, 7] }} />,
    );

    expect(container.querySelectorAll('.lg\\:col-span-5')).toHaveLength(2);
    expect(container.querySelectorAll('.lg\\:col-span-7')).toHaveLength(2);
  });

  it('sin reparto asimétrico las tarjetas no llevan clase de columna', () => {
    const { container } = render(<CardGridBlock data={base} />);

    expect(container.querySelector('[class*="col-span"]')).toBeNull();
  });
});

describe('CardGridBlock — sección', () => {
  it('acepta source y sourceConfig aunque todavía no los use', () => {
    // El campo existe para que el editor configure la colección; quien la
    // resuelve es el site, no este bloque.
    const { container } = render(
      <CardGridBlock
        data={{ ...base, source: 'articles', sourceConfig: { limit: 3, featured: true } }}
      />,
    );

    expect(container.querySelector('section')).toBeTruthy();
    expect(screen.getByText('Capbreton')).toBeTruthy();
  });

  it('el fondo y los botones de sección salen de las piezas compartidas', () => {
    const { container } = render(
      <CardGridBlock
        data={{
          ...base,
          background: 'muted',
          ctas: [{ label: 'Explorer toute la région', url: '/region' }],
        }}
      />,
    );

    expect(container.querySelector('section')?.className).toContain('bg-muted/40');
    expect(screen.getByText('Explorer toute la région')).toBeTruthy();
  });
});
