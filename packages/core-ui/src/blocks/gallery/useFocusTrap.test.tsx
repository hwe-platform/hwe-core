import { act, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';

import { useFocusTrap } from './useFocusTrap';

/** Un diálogo mínimo con tres focos, para probar el atrapado sin montar el lightbox real. */
function Dialogo({ activo }: { activo: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, activo);

  if (!activo) return <button type="button">Abrir</button>;

  return (
    <div ref={ref} role="dialog">
      <button type="button">Primero</button>
      <button type="button">Segundo</button>
      <button type="button">Último</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('mueve el foco al primer elemento operable al activarse', () => {
    render(<Dialogo activo />);

    expect(document.activeElement).toHaveTextContent('Primero');
  });

  it('Tab en el último vuelve al primero', () => {
    render(<Dialogo activo />);

    const ultimo = document.querySelector('button:last-of-type') as HTMLElement;
    act(() => ultimo.focus());

    fireEvent.keyDown(document, { key: 'Tab' });

    expect(document.activeElement).toHaveTextContent('Primero');
  });

  it('Shift+Tab en el primero va al último', () => {
    render(<Dialogo activo />);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toHaveTextContent('Último');
  });

  it('devuelve el foco a quien abrió el diálogo, al desactivarse', () => {
    const { rerender } = render(
      <>
        <button type="button">Disparador</button>
        <Dialogo activo={false} />
      </>,
    );

    const disparador = document.querySelector('button') as HTMLElement;
    act(() => disparador.focus());

    rerender(
      <>
        <button type="button">Disparador</button>
        <Dialogo activo />
      </>,
    );
    expect(document.activeElement).toHaveTextContent('Primero');

    rerender(
      <>
        <button type="button">Disparador</button>
        <Dialogo activo={false} />
      </>,
    );

    expect(document.activeElement).toHaveTextContent('Disparador');
  });
});
