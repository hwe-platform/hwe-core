import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Link } from './Link';

describe('Link', () => {
  it('renderiza un enlace interno sin target blank', () => {
    render(<Link href="/alojamientos">Ver alojamientos</Link>);
    const link = screen.getByRole('link', { name: 'Ver alojamientos' });
    expect(link).toHaveAttribute('href', '/alojamientos');
    expect(link).not.toHaveAttribute('target');
  });

  it('renderiza un enlace externo con target blank y rel seguro', () => {
    render(<Link href="https://instagram.com/lacivelle">Instagram</Link>);
    const link = screen.getByRole('link', { name: 'Instagram' });
    expect(link).toHaveAttribute('href', 'https://instagram.com/lacivelle');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Link href="/alojamientos">Ver alojamientos</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
