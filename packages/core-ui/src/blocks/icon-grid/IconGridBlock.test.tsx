import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { IconGridBlock } from './IconGridBlock';

/** Un bloque válido mínimo; cada test cambia solo el eje que comprueba. */
const base = {
  blockType: 'icon-grid' as const,
  columns: 3,
  variant: 'bare' as const,
  items: [
    { icon: 'treePine', label: 'Au cœur de la forêt landaise', description: '11 hectares' },
    { icon: 'waves', label: 'À 800 m des plages' },
  ],
};

/** Un icono del cliente, como los tres SVG que trae el export. */
function IconoPropio({ className }: { className?: string }) {
  return <svg className={className} data-testid="icono-propio" />;
}

afterEach(() => vi.restoreAllMocks());

describe('IconGridBlock', () => {
  it('no pinta nada si los datos no cuadran con el schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<IconGridBlock data={{ blockType: 'otro' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pinta cada item con su etiqueta y su descripción', () => {
    render(<IconGridBlock data={base} />);

    expect(screen.getByText('Au cœur de la forêt landaise')).toBeTruthy();
    expect(screen.getByText('11 hectares')).toBeTruthy();
    expect(screen.getByText('À 800 m des plages')).toBeTruthy();
  });

  it('la descripción es opcional', () => {
    const { container } = render(
      <IconGridBlock data={{ ...base, items: [{ icon: 'waves', label: 'Solo etiqueta' }] }} />,
    );

    expect(screen.getByText('Solo etiqueta')).toBeTruthy();
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('pinta la cabecera solo cuando hay antetítulo o titular', () => {
    const { container: sinCabecera } = render(<IconGridBlock data={base} />);
    const { container: conCabecera } = render(
      <IconGridBlock data={{ ...base, subtitle: 'Notre esprit', title: 'Pourquoi choisir' }} />,
    );

    expect(sinCabecera.querySelector('h2')).toBeNull();
    expect(conCabecera.querySelector('h2')?.textContent).toBe('Pourquoi choisir');
    expect(screen.getByText('Notre esprit')).toBeTruthy();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <IconGridBlock data={{ ...base, subtitle: 'Notre esprit', title: 'Pourquoi choisir' }} />,
    );

    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('IconGridBlock — ejes', () => {
  it('el número de columnas llega a la clase de retícula', () => {
    const { container } = render(<IconGridBlock data={{ ...base, columns: 6 }} />);

    expect(container.querySelector('.lg\\:grid-cols-6')).toBeTruthy();
  });

  it('la variante bare deja la etiqueta como encabezado', () => {
    const { container } = render(<IconGridBlock data={base} />);

    expect(container.querySelector('h3')?.textContent).toBe('Au cœur de la forêt landaise');
  });

  it('la variante card envuelve cada item y baja la etiqueta a rótulo', () => {
    const { container } = render(<IconGridBlock data={{ ...base, variant: 'card' }} />);

    expect(container.querySelector('h3')).toBeNull();
    expect(container.querySelectorAll('.bg-card.rounded-2xl')).toHaveLength(2);
  });

  it('la escala se deriva del número de columnas, no de otro campo', () => {
    // Tres o menos: marco de 96px. Más: de 80px. Es una sola regla para el
    // tamaño del marco, la tipografía y la separación.
    const { container: amplio } = render(<IconGridBlock data={{ ...base, columns: 3 }} />);
    const { container: estrecho } = render(<IconGridBlock data={{ ...base, columns: 6 }} />);

    expect(amplio.querySelector('.h-24.w-24')).toBeTruthy();
    expect(estrecho.querySelector('.h-20.w-20')).toBeTruthy();
  });
});

describe('IconGridBlock — sección', () => {
  it('el fondo por defecto es el de tarjeta, y none deja ver la página', () => {
    const { container: porDefecto } = render(<IconGridBlock data={base} />);
    const { container: apagado } = render(
      <IconGridBlock data={{ ...base, background: 'muted' }} />,
    );
    const { container: sinFondo } = render(
      <IconGridBlock data={{ ...base, background: 'none' }} />,
    );

    expect(porDefecto.querySelector('section')?.className).toContain('bg-card');
    expect(apagado.querySelector('section')?.className).toContain('bg-muted/40');
    expect(sinFondo.querySelector('section')?.className).not.toContain('bg-');
  });

  it('el párrafo de entrada va bajo el titular y es independiente del antetítulo', () => {
    render(
      <IconGridBlock
        data={{
          ...base,
          subtitle: 'Sur place',
          title: 'Activités & Services',
          description: 'Tout ce dont vous avez besoin pour des vacances réussies.',
        }}
      />,
    );

    expect(screen.getByText('Sur place')).toBeTruthy();
    expect(
      screen.getByText('Tout ce dont vous avez besoin pour des vacances réussies.'),
    ).toBeTruthy();
  });

  it('sin párrafo de entrada no se pinta nada de más', () => {
    const { container } = render(<IconGridBlock data={{ ...base, title: 'Solo titular' }} />);

    expect(container.querySelector('h2')?.className).not.toContain('mb-6');
  });

  it('los botones solo aparecen si la lista trae alguno', () => {
    const { container: sinBotones } = render(<IconGridBlock data={base} />);
    const { container: conBoton } = render(
      <IconGridBlock
        data={{
          ...base,
          ctas: [{ label: 'Voir tous les services', url: '/services', icon: 'arrowRight' }],
        }}
      />,
    );

    expect(sinBotones.querySelector('a')).toBeNull();
    expect(conBoton.querySelector('a')?.getAttribute('href')).toBe('/services');
    expect(screen.getByText('Voir tous les services')).toBeTruthy();
    expect(conBoton.querySelector('.lucide-arrow-right')).toBeTruthy();
  });
});

describe('IconGridBlock — resolución de iconos', () => {
  it('el registro del site gana sobre el set de plataforma', () => {
    // Un cliente tiene que poder sustituir un icono de plataforma por el suyo
    // sin pedir permiso: por eso el registro se consulta primero.
    render(
      <IconGridBlock
        data={{ ...base, items: [{ icon: 'waves', label: 'Piscine' }] }}
        iconRegistry={{ waves: IconoPropio }}
      />,
    );

    expect(screen.getByTestId('icono-propio')).toBeTruthy();
  });

  it('resuelve un icono propio que no existe en lucide', () => {
    render(
      <IconGridBlock
        data={{ ...base, items: [{ icon: 'eauChauffee', label: 'Eau chauffée' }] }}
        iconRegistry={{ eauChauffee: IconoPropio }}
      />,
    );

    expect(screen.getByTestId('icono-propio')).toBeTruthy();
  });

  it('un nombre que no conoce nadie cae al respaldo y no rompe la página', () => {
    // El nombre lo escribe un editor a mano: una errata no puede tumbar nada.
    // El aviso solo existe en desarrollo, así que hay que ponerse ahí: en
    // tests `NODE_ENV` vale `test` y la rama no se ejecutaría.
    vi.stubEnv('NODE_ENV', 'development');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <IconGridBlock data={{ ...base, items: [{ icon: 'noExiste', label: 'Servicio' }] }} />,
    );

    expect(screen.getByText('Servicio')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('noExiste'));
    vi.unstubAllEnvs();
  });
});

describe('Cabecera — tono del titular', () => {
  it('por defecto el titular va en el color de texto', () => {
    // Tres de las cuatro secciones del diseño de referencia lo llevan así.
    const { container } = render(<IconGridBlock data={{ ...base, title: 'Sur place' }} />);

    const titular = container.querySelector('h2');
    expect(titular?.className).toContain('text-foreground');
  });

  it('el tono de marca lo pone en el color primario', () => {
    // «Pourquoi choisir La Civelle ?», la única que lo destaca.
    const { container } = render(
      <IconGridBlock data={{ ...base, title: 'Pourquoi choisir ?', headingTone: 'brand' }} />,
    );

    const titular = container.querySelector('h2');
    expect(titular?.className).toContain('text-primary');
  });
});
