import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';

import { Eyebrow } from './Eyebrow';

describe('Eyebrow', () => {
  it('usa el color de acento, que es donde el diseño pone las etiquetas', () => {
    render(<Eyebrow>Notre esprit</Eyebrow>);
    expect(screen.getByText('Notre esprit').className).toContain('text-secondary');
  });

  it('es un párrafo por defecto: acompaña al encabezado, no lo sustituye', () => {
    const { container } = render(<Eyebrow>Sur place</Eyebrow>);
    expect(container.querySelector('p')).toHaveTextContent('Sur place');
    expect(container.querySelector('h1, h2, h3')).toBeNull();
  });

  it('puede encabezar una región cuando tiene significado propio', () => {
    const { container } = render(
      <Eyebrow as="h2" size="sm">
        Plan du site
      </Eyebrow>,
    );
    expect(container.querySelector('h2')).toHaveTextContent('Plan du site');
  });

  it('los tamaños cambian el espaciado entre letras, que es lo que varía en el diseño', () => {
    const { container: pequeno } = render(<Eyebrow size="sm">a</Eyebrow>);
    const { container: medio } = render(<Eyebrow size="md">b</Eyebrow>);
    const { container: grande } = render(<Eyebrow size="lg">c</Eyebrow>);

    expect(pequeno.firstElementChild?.className).toContain('tracking-[1.1px]');
    expect(medio.firstElementChild?.className).toContain('tracking-[3.6px]');
    expect(grande.firstElementChild?.className).toContain('tracking-[4.6px]');
  });

  it('la variante badge la pinta como píldora', () => {
    render(<Eyebrow variant="badge">Camping</Eyebrow>);
    const etiqueta = screen.getByText('Camping');
    expect(etiqueta.className).toContain('rounded-full');
    expect(etiqueta.className).toContain('bg-secondary/10');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Eyebrow>Notre ADN</Eyebrow>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Eyebrow — línea de acento', () => {
  it('sin rule no añade ningún envoltorio', () => {
    const { container } = render(<Eyebrow>Etiqueta</Eyebrow>);

    expect(container.firstElementChild?.tagName).toBe('P');
  });

  it('con rule pinta una línea decorativa oculta a lectores, delante del texto', () => {
    const { container } = render(<Eyebrow rule>Etiqueta</Eyebrow>);

    const linea = container.querySelector('span[aria-hidden]');
    expect(linea).toBeTruthy();
    expect(linea?.className).toContain('bg-secondary');
    expect(container.textContent).toBe('Etiqueta');
  });
});
