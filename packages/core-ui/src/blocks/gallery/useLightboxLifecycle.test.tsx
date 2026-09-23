import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLightboxLifecycle } from './useLightboxLifecycle';

/** Un componente mínimo, para probar el hook sin montar el lightbox real. */
function Sonda({ onClose }: { onClose: () => void }) {
  useLightboxLifecycle(onClose);
  return null;
}

describe('useLightboxLifecycle', () => {
  it('llama a onClose al pulsar Escape', () => {
    const onClose = vi.fn();
    render(<Sonda onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('ignora otras teclas', () => {
    const onClose = vi.fn();
    render(<Sonda onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('bloquea el scroll del body mientras está montado, y lo devuelve al desmontar', () => {
    const overflowPrevio = document.body.style.overflow;
    const { unmount } = render(<Sonda onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe(overflowPrevio);
  });

  it('no deja el listener de teclado huérfano tras desmontar', () => {
    const onClose = vi.fn();
    const { unmount } = render(<Sonda onClose={onClose} />);

    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });
});
