import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { MediaTextBlock } from './MediaTextBlock';

/**
 * Una referencia de media poblada. `mediaRefSchema` admite un id o el documento
 * entero, y el bloque necesita el documento para sacar la URL.
 */
const imagen = {
  id: 1,
  filename: 'foto.jpg',
  url: '/foto.jpg',
  alt: 'Pinar landés',
  mimeType: 'image/jpeg',
  filesize: 12345,
};

/** Un mapa de los que el diseño usa, y de los pocos dominios incrustables. */
const MAPA = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891';

/** Un bloque válido mínimo; cada test cambia solo el eje que comprueba. */
const base = {
  blockType: 'media-text' as const,
  title: 'Un havre de paix',
  media: 'image' as const,
  image: imagen,
  split: 6,
  reverse: false,
  align: 'center' as const,
  ratio: 'landscape' as const,
  ctas: [],
};

afterEach(() => vi.restoreAllMocks());

describe('MediaTextBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<MediaTextBlock data={{ blockType: 'otro' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta título, etiqueta y botones', () => {
    render(
      <MediaTextBlock
        data={{
          ...base,
          subtitle: 'Le Camping',
          ctas: [{ label: 'Découvrir', url: '/le-camping', variant: 'primary' }],
        }}
      />,
    );

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Un havre de paix');
    expect(screen.getByText('Le Camping')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Découvrir' })).toBeTruthy();
  });

  // El eje es numérico a propósito: La Civelle ya usa 5, 6 y 7, así que una
  // enumeración de los repartos vistos se rompería con el cliente siguiente.
  it.each([
    [5, 'lg:col-span-5', 'lg:col-span-7'],
    [6, 'lg:col-span-6', 'lg:col-span-6'],
    [7, 'lg:col-span-7', 'lg:col-span-5'],
    [4, 'lg:col-span-4', 'lg:col-span-8'],
  ])('admite el reparto %i, no solo los del Figma', (split, medio, texto) => {
    const { container } = render(<MediaTextBlock data={{ ...base, split }} />);
    const html = container.innerHTML;

    expect(html).toContain(medio);
    expect(html).toContain(texto);
  });

  it('invierte el orden de las columnas cuando reverse', () => {
    const { container: normal } = render(<MediaTextBlock data={base} />);
    const { container: invertido } = render(<MediaTextBlock data={{ ...base, reverse: true }} />);

    expect(normal.innerHTML).not.toContain('lg:order-2');
    expect(invertido.innerHTML).toContain('lg:order-2');
  });
});

describe('MediaTextBlock — tipos de medio', () => {
  it('acepta los tres tipos de medio, cada uno con su propia anatomía', async () => {
    const { container: conImagen } = render(<MediaTextBlock data={base} />);
    const { container: conEmbed } = render(
      <MediaTextBlock data={{ ...base, media: 'embed', embedUrl: MAPA }} />,
    );
    // `MediaCarousel` llega vía `next/dynamic` — la sección existe desde el
    // primer render, el carrusel en sí llega después, igual que en Gallery.
    render(<MediaTextBlock data={{ ...base, media: 'carousel', images: [imagen, imagen] }} />);

    expect(conImagen.querySelector('img')).toBeTruthy();
    expect(conEmbed.querySelector('iframe')).toBeTruthy();
    expect(await screen.findByLabelText('Image suivante')).toBeTruthy();
  });

  it('el carrusel avanza y da la vuelta', async () => {
    render(
      <MediaTextBlock data={{ ...base, media: 'carousel', images: [imagen, imagen, imagen] }} />,
    );

    expect(await screen.findByText('1 / 3')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Image suivante'));
    expect(await screen.findByText('2 / 3')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Image précédente'));
    fireEvent.click(screen.getByLabelText('Image précédente'));
    expect(await screen.findByText('3 / 3')).toBeTruthy();
  });

  it('no pinta flechas con una sola imagen', async () => {
    render(<MediaTextBlock data={{ ...base, media: 'carousel', images: [imagen] }} />);

    // Espera a que el carrusel termine de cargar antes de comprobar su ausencia
    // — si no, «no hay flechas todavía» y «no habrá flechas nunca» se confunden.
    await screen.findByRole('region');
    expect(screen.queryByLabelText('Image suivante')).toBeNull();
  });
});

describe('MediaTextBlock — slots', () => {
  // El slot resuelve tres cajas distintas del Figma —horarios, features y
  // estadísticas— sin que el bloque sepa nada de ninguna.
  it.each([
    ['horarios del restaurante', <p key="h">Ouvert de 8h à 23h</p>],
    [
      'features de la piscine',
      <ul key="f">
        <li>Chauffée</li>
      </ul>,
    ],
    ['barra de estadísticas', <span key="s">11 hectares</span>],
  ])('el slot aside acepta %s sin cambiar el bloque', (_nombre, contenido) => {
    render(<MediaTextBlock data={base} aside={contenido} />);

    expect(screen.getByText(/Ouvert|Chauffée|11 hectares/)).toBeTruthy();
  });

  it('el slot sobreLaImagen cuelga del contenedor del medio', () => {
    const { container } = render(
      <MediaTextBlock data={base} sobreLaImagen={<span data-testid="medallon">30</span>} />,
    );

    const medallon = screen.getByTestId('medallon');
    expect(container.querySelector('.relative')?.contains(medallon)).toBe(true);
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <MediaTextBlock
        data={{
          ...base,
          subtitle: 'Le Camping',
          ctas: [{ label: 'Ver', url: '/x', variant: 'primary' }],
        }}
        aside={<p>Horarios</p>}
      />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('MediaTextBlock — sin datos opcionales', () => {
  it('embed usa el título del bloque como title del iframe, y el rótulo si no hay', () => {
    const { container: conTitulo } = render(
      <MediaTextBlock data={{ ...base, media: 'embed', embedUrl: MAPA }} />,
    );
    const { container: sinTitulo } = render(
      <MediaTextBlock data={{ ...base, title: undefined, media: 'embed', embedUrl: MAPA }} />,
    );

    expect(conTitulo.querySelector('iframe')?.getAttribute('title')).toBe('Un havre de paix');
    expect(sinTitulo.querySelector('iframe')?.getAttribute('title')).toBe('Contenu intégré');
  });
});

describe('MediaTextBlock — barreras y ejes de detalle', () => {
  it('un embed de un dominio que no está en la lista no se pinta', () => {
    // Sin esto, quien edita el panel puede meter cualquier documento —incluido
    // un `data:text/html` con su propio script— dentro de una página del
    // cliente. Lo rechaza el schema, y el componente vuelve a mirar.
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <MediaTextBlock data={{ ...base, media: 'embed', embedUrl: 'https://evil.example/x' }} />,
    );

    expect(container.querySelector('iframe')).toBeNull();
  });

  it('el antetítulo lleva la línea de acento solo si el bloque la pide', () => {
    // Dos de los diecisiete antetítulos del diseño la llevan: es un eje.
    const { container: sinLinea } = render(
      <MediaTextBlock data={{ ...base, subtitle: 'Baignade & Détente' }} />,
    );
    const { container: conLinea } = render(
      <MediaTextBlock data={{ ...base, subtitle: 'Baignade & Détente', eyebrowRule: true }} />,
    );

    expect(sinLinea.querySelector('[aria-hidden].bg-secondary')).toBeNull();
    expect(conLinea.querySelector('[aria-hidden].bg-secondary')).toBeTruthy();
  });

  it('el iframe va aislado con sandbox', () => {
    const { container } = render(
      <MediaTextBlock data={{ ...base, media: 'embed', embedUrl: MAPA }} />,
    );

    expect(container.querySelector('iframe')?.getAttribute('sandbox')).toContain('allow-scripts');
    expect(container.querySelector('iframe')?.getAttribute('sandbox')).not.toContain(
      'allow-same-origin',
    );
  });

  it('image sin url en el media no pinta el marco', () => {
    const { container } = render(
      <MediaTextBlock data={{ ...base, image: { ...imagen, url: undefined } }} />,
    );

    expect(container.querySelector('img')).toBeNull();
  });

  it('un reparto fuera del dominio lo rechaza el schema y no se pinta nada', () => {
    // El respaldo del reparto se prueba aparte, en ratio.test.ts: aquí no se
    // llega a él porque el bloque valida antes de renderizar.
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<MediaTextBlock data={{ ...base, split: 99 }} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('MediaTextBlock — rótulos y datos crudos', () => {
  it('los rótulos del carrusel se pueden sobrescribir por props', async () => {
    render(
      <MediaTextBlock
        data={{ ...base, media: 'carousel', images: [imagen, imagen] }}
        labels={{ next: 'Siguiente' }}
      />,
    );

    expect(await screen.findByLabelText('Siguiente')).toBeTruthy();
    expect(screen.getByLabelText('Image précédente')).toBeTruthy();
  });

  it('acepta un dato crudo de Payload con null en los opcionales', () => {
    const { container } = render(
      <MediaTextBlock
        data={{ ...base, subtitle: null, content: null, image: { ...imagen, caption: null } }}
      />,
    );

    expect(container.querySelector('section')).toBeTruthy();
  });
});

describe('MediaTextBlock — titular, fondo e iconos', () => {
  it('parte el titular en dos con la segunda línea en acento', () => {
    const { container } = render(
      <MediaTextBlock
        data={{
          ...base,
          title: 'Bienvenue au Camping La Civelle,',
          titleAccent: 'votre camping à Capbreton',
        }}
      />,
    );

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2.textContent).toBe('Bienvenue au Camping La Civelle,votre camping à Capbreton');
    expect(h2.querySelector('span')?.className).toContain('text-secondary');
    void container;
  });

  it('sin titleAccent el titular es una sola línea', () => {
    render(<MediaTextBlock data={base} />);

    expect(screen.getByRole('heading', { level: 2 }).querySelector('span')).toBeNull();
  });

  it.each([
    ['default', 'bg-card'],
    ['muted', 'bg-muted/40'],
  ])('el fondo %s aplica su clase', (background, clase) => {
    const { container } = render(<MediaTextBlock data={{ ...base, background }} />);

    expect(container.querySelector('section')?.className).toContain(clase);
  });

  it('el fondo none deja ver el color de página', () => {
    const { container } = render(<MediaTextBlock data={{ ...base, background: 'none' }} />);
    const clases = container.querySelector('section')?.className ?? '';

    expect(clases).not.toContain('bg-card');
    expect(clases).not.toContain('bg-muted');
  });
});

describe('MediaTextBlock — iconos de los CTA', () => {
  it('pinta el icono del CTA cuando el nombre existe en el set', () => {
    const { container } = render(
      <MediaTextBlock
        data={{
          ...base,
          ctas: [{ label: 'En savoir plus', url: '/x', variant: 'primary', icon: 'arrowRight' }],
        }}
      />,
    );

    expect(container.querySelector('a svg')).toBeTruthy();
  });

  // El editor escribe el nombre a mano: una errata no debe romper la página.
  it('ignora un icono que el set no conoce', () => {
    const { container } = render(
      <MediaTextBlock
        data={{
          ...base,
          ctas: [{ label: 'Ver', url: '/x', variant: 'primary', icon: 'noExiste' }],
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Ver' })).toBeTruthy();
    expect(container.querySelector('a svg')).toBeNull();
  });
});
