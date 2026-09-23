import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BlockCtas, Cabecera, fondoDe } from './seccion';

/**
 * Las piezas que comparten los bloques de sección.
 *
 * Los bloques ya las ejercitan de paso, pero aquí se prueban sus respaldos:
 * los casos que el schema de un bloque nunca deja pasar y que sí aparecen
 * cuando un override pinta la pieza con datos crudos.
 */

describe('fondoDe', () => {
  it('traduce los fondos del diseño', () => {
    expect(fondoDe('default')).toBe('bg-card');
    expect(fondoDe('muted')).toBe('bg-muted/40');
  });

  it('`none` deja ver el color de página', () => {
    expect(fondoDe('none')).toBe('');
  });

  it('un fondo que no está en la tabla no ensucia la clase', () => {
    expect(fondoDe('inventado')).toBe('');
  });
});

describe('Cabecera', () => {
  it('sin ninguna de las tres piezas no pinta ni el contenedor', () => {
    const { container } = render(<Cabecera />);

    expect(container.firstChild).toBeNull();
  });

  it('un tono que no está en la tabla cae al color de texto', () => {
    // El schema acota el eje, pero un override puede pintar la cabecera con
    // datos crudos: sin respaldo el titular se quedaría sin color.
    const { container } = render(<Cabecera title="Sur place" tone="inventado" />);

    expect(container.querySelector('h2')?.className).toContain('text-foreground');
  });
});

describe('BlockCtas', () => {
  it('sin enlaces no pinta nada, así que el bloque no tiene que comprobarlo', () => {
    const { container } = render(<BlockCtas ctas={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('un icono que el set no conoce no se pinta, pero el enlace sí', () => {
    // El nombre del icono lo escribe el editor a mano.
    const { container } = render(
      <BlockCtas
        ctas={[{ label: 'Découvrir', url: '/le-camping', variant: 'primary', icon: 'noExiste' }]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Découvrir' })).toBeTruthy();
    expect(container.querySelector('svg')).toBeNull();
  });
});
