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
