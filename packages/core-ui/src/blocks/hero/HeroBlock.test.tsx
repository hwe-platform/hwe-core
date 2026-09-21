import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { HeroBlock } from './HeroBlock';

/** Un media poblado: `mediaRefSchema` admite un id o el documento entero. */
const video = {
  id: 1,
  filename: 'hero.mp4',
  url: '/hero.mp4',
  alt: 'Vista aérea del camping',
  mimeType: 'video/mp4',
  filesize: 20000,
};

/** Un hero válido mínimo, al que cada test le cambia lo que le interesa. */
const base = {
  variant: 'image' as const,
  title: 'Le Camping',
  titleMode: 'text' as const,
  align: 'left' as const,
  showBreadcrumbs: false,
};

afterEach(() => vi.restoreAllMocks());

describe('HeroBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<HeroBlock data={{ variant: 'inventada' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('no pinta nada con la variante none, que significa "sin cabecera"', () => {
    const { container } = render(<HeroBlock data={{ ...base, variant: 'none' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('resuelve la variante por mapa: video y image dan marcas distintas', () => {
    const { container: conVideo } = render(
      <HeroBlock data={{ ...base, variant: 'video', media: video }} />,
    );
    const { container: conImagen } = render(<HeroBlock data={base} />);

    expect(conVideo.querySelector('video')).toBeTruthy();
    expect(conImagen.querySelector('video')).toBeNull();
  });
});

describe('HeroBlock — contenido', () => {
  it('pinta el supertítulo, el titular y el subtítulo', () => {
    render(
      <HeroBlock data={{ ...base, eyebrow: 'Capbreton · Landes', subtitle: '11 hectares' }} />,
    );

    expect(screen.getByText('Capbreton · Landes')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Le Camping');
    expect(screen.getByText('11 hectares')).toBeTruthy();
  });

  // El export deja la home sin encabezado legible porque su título es el logo.
  // Es un fallo de accesibilidad y SEO que no se copia (DEC-002).
  it('mantiene un h1 legible aunque el titular sea el logo', () => {
    render(
      <HeroBlock
        data={{ ...base, titleMode: 'logo' }}
        logoUrl="/logo.png"
        siteName="Camping La Civelle"
      />,
    );

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Camping La Civelle');
    expect(h1.className).toContain('sr-only');
  });
});

describe('HeroBlock — migas de pan', () => {
  it('solo pinta las migas si showBreadcrumbs lo pide', () => {
    const migas = [{ label: 'Accueil', url: '/' }, { label: 'Le Camping' }];
    const { queryByLabelText } = render(<HeroBlock data={base} breadcrumbs={migas} />);
    expect(queryByLabelText("Fil d'Ariane")).toBeNull();

    render(<HeroBlock data={{ ...base, showBreadcrumbs: true }} breadcrumbs={migas} />);
    expect(screen.getByLabelText("Fil d'Ariane")).toBeTruthy();
  });

  it('marca el último nivel de las migas como página actual y sin enlace', () => {
    render(
      <HeroBlock
        data={{ ...base, showBreadcrumbs: true }}
        breadcrumbs={[
          { label: 'Accueil', url: '/' },
          { label: 'Le Camping', url: '/le-camping' },
        ]}
      />,
    );

    const actual = screen.getByText('Le Camping', { selector: 'span' });
    expect(actual.getAttribute('aria-current')).toBe('page');
  });
});

describe('HeroBlock — variantes', () => {
  // No sale del Figma: existe porque el modelo de datos ya declaraba la
  // variante, y una variante declarada que no pinta nada es una página en
  // blanco esperando a que alguien la elija en el panel.
  it('la variante minimal pinta cabecera sin imagen', () => {
    const { container } = render(
      <HeroBlock
        data={{ ...base, variant: 'minimal', showBreadcrumbs: true }}
        breadcrumbs={[{ label: 'Accueil' }]}
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Le Camping');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('video')).toBeNull();
  });

  it('la variante image pinta su imagen de fondo con el alt del media', () => {
    const { container } = render(
      <HeroBlock
        data={{ ...base, media: { ...video, filename: 'bosque.jpg', mimeType: 'image/jpeg' } }}
      />,
    );

    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Vista aérea del camping');
  });

  it('la alineación centrada cambia las clases, no el marcado', () => {
    const { container: izquierda } = render(<HeroBlock data={base} />);
    const { container: centrado } = render(<HeroBlock data={{ ...base, align: 'center' }} />);

    expect(izquierda.innerHTML).toContain('items-start');
    expect(centrado.innerHTML).toContain('items-center');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <HeroBlock
        data={{ ...base, showBreadcrumbs: true, eyebrow: 'Capbreton', subtitle: 'Landes' }}
        breadcrumbs={[{ label: 'Accueil', url: '/' }, { label: 'Le Camping' }]}
      />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

// Ramas que el revisor encontró sin cubrir: los caminos "sin dato", que son
// justo los que en producción salen de un editor que aún no ha rellenado.
describe('HeroBlock — sin datos opcionales', () => {
  it('video sin media no pinta la etiqueta video pero sí el contenido', () => {
    const { container } = render(<HeroBlock data={{ ...base, variant: 'video' }} />);

    expect(container.querySelector('video')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Le Camping');
  });

  it('image sin media no pinta la imagen de fondo', () => {
    const { container } = render(<HeroBlock data={{ ...base, media: undefined }} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('con logo y sin siteName, el h1 oculto usa el título', () => {
    render(<HeroBlock data={{ ...base, titleMode: 'logo' }} logoUrl="/logo.png" />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Le Camping');
  });

  it('con logo pero sin logoUrl, cae al titular de texto', () => {
    const { container } = render(<HeroBlock data={{ ...base, titleMode: 'logo' }} />);

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).className).not.toContain('sr-only');
  });

  it('minimal centrado y video centrado usan la alineación centrada', () => {
    const { container: minimal } = render(
      <HeroBlock data={{ ...base, variant: 'minimal', align: 'center' }} />,
    );
    const { container: video } = render(
      <HeroBlock data={{ ...base, variant: 'video', align: 'center' }} />,
    );

    expect(minimal.innerHTML).toContain('items-center');
    expect(video.innerHTML).toContain('items-center');
  });

  it('los rótulos se pueden sobrescribir por props', () => {
    render(
      <HeroBlock
        data={{ ...base, showBreadcrumbs: true }}
        breadcrumbs={[{ label: 'Accueil', url: '/' }, { label: 'Le Camping' }]}
        labels={{ breadcrumbs: 'Ruta' }}
      />,
    );

    expect(screen.getByLabelText('Ruta')).toBeTruthy();
  });
});
