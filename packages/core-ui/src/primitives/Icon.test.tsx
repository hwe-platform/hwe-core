import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Icon, ICON_NAMES } from './Icon';

describe('Icon', () => {
  it('renderiza un icono del set predefinido', () => {
    const { container } = render(<Icon name="bed" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('es decorativo (aria-hidden) por defecto', () => {
    const { container } = render(<Icon name="waves" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('expone aria-label cuando se pasa', () => {
    const { container } = render(<Icon name="x" aria-label="Cerrar" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Cerrar');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it.each(['sm', 'md', 'lg'] as const)('renderiza el tamaño %s', (size) => {
    const { container } = render(<Icon name="star" size={size} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Icon name="heart" aria-label="Favorito" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ICON_NAMES', () => {
  it('lista todos los iconos del set', () => {
    expect(ICON_NAMES).toContain('utensils');
    expect(ICON_NAMES).toContain('pawPrint');
    expect(ICON_NAMES).toContain('help');
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(20);
  });

  it('cada nombre listado renderiza sin romper', () => {
    for (const name of ICON_NAMES) {
      const { container } = render(<Icon name={name} />);
      expect(container.querySelector('svg')).not.toBeNull();
    }
  });
});
