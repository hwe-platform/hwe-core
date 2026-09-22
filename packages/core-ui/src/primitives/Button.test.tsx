import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from './Button';
import { Icon } from './Icon';

describe('Button', () => {
  it('renderiza como <button> por defecto', () => {
    render(<Button>Reservar</Button>);
    expect(screen.getByRole('button', { name: 'Reservar' })).toBeInTheDocument();
  });

  it('renderiza como <a> cuando se pasa href', () => {
    render(<Button href="/alojamientos">Ver alojamientos</Button>);
    const link = screen.getByRole('link', { name: 'Ver alojamientos' });
    expect(link).toHaveAttribute('href', '/alojamientos');
  });

  it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
    'renderiza la variante %s',
    (variant) => {
      render(<Button variant={variant}>Texto</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('renderiza el tamaño %s', (size) => {
    render(<Button size={size}>Texto</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad con texto visible', async () => {
    const { container } = render(<Button>Reservar</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no tiene violaciones de accesibilidad con icono y aria-label', async () => {
    const { container } = render(
      <Button aria-label="Cerrar" variant="ghost" size="sm">
        <Icon name="x" />
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Button — la forma sale de los tokens del cliente', () => {
  it('un botón de talla por defecto lleva los tokens', () => {
    render(<Button variant="primary">Réserver</Button>);

    const boton = screen.getByRole('button', { name: 'Réserver' });
    expect(boton.className).toContain('--button-px');
    expect(boton.className).toContain('--button-font-size');
    expect(boton.className).toContain('--button-shadow');
  });

  it('las tallas excepcionales siguen siendo escalones fijos', () => {
    render(
      <Button variant="primary" size="sm">
        Filtrer
      </Button>,
    );

    const boton = screen.getByRole('button', { name: 'Filtrer' });
    expect(boton.className).toContain('text-sm');
    expect(boton.className).not.toContain('--button-font-size');
  });
});

describe('Button — los dos enlaces del lenguaje visual', () => {
  it('el enlace de tarjeta no arrastra el relleno ni la sombra de la talla', () => {
    render(
      <Button href="/blog/uno" variant="link">
        {"Lire l'article"}
      </Button>,
    );

    const enlace = screen.getByRole('link', { name: "Lire l'article" });
    expect(enlace.className).toContain('bg-transparent');
    expect(enlace.className).not.toContain('border-b-2');
    // Los tokens de botón son de los botones: un enlace no arrastra su
    // relleno, su sombra ni su cuerpo.
    expect(enlace.className).not.toContain('--button-px');
    expect(enlace.className).not.toContain('--button-shadow');
    expect(enlace.className).not.toContain('--button-font-size');
  });

  it('el enlace de sección va en color de marca, con línea inferior y cuerpo mayor', () => {
    // «Voir toutes les actualités»: lenguaje-visual.md lo define así, y es el
    // segundo tratamiento de enlace del diseño, no un `link` más grande.
    render(
      <Button href="/blog" variant="link-underline">
        Voir toutes les actualités
      </Button>,
    );

    const enlace = screen.getByRole('link', { name: 'Voir toutes les actualités' });
    expect(enlace.className).toContain('text-primary');
    expect(enlace.className).toContain('border-b-2');
    expect(enlace.className).toContain('border-primary/20');
    expect(enlace.className).toContain('text-xl');
    // Sin esto el cuerpo no se aplica: la hoja emite la utilidad de token
    // después de `text-xl`, así que convivir con ella dejaba el enlace a 1rem.
    expect(enlace.className).not.toContain('--button-font-size');
  });
});

describe('Button', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('avisa por consola si es icon-only sin aria-label', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Button variant="ghost" size="sm">
        <Icon name="x" />
      </Button>,
    );
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('no avisa cuando hay aria-label', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Button aria-label="Cerrar" variant="ghost" size="sm">
        <Icon name="x" />
      </Button>,
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
