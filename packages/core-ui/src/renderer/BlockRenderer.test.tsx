import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { BlockRenderer } from './BlockRenderer';

import type { ReactNode } from 'react';
import type { BlockInstance, BlockRegistry } from './types';

/** Bloque de prueba que pinta su propio tipo, para distinguir quién renderizó. */
function marcador(etiqueta: string) {
  return function Marcador() {
    return <p>{etiqueta}</p>;
  };
}

const bloque = (blockType: string, id = blockType): BlockInstance => ({ blockType, id });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('BlockRenderer', () => {
  it('renderiza cada bloque conocido con su componente', () => {
    const registry: BlockRegistry = { uno: marcador('bloque uno'), dos: marcador('bloque dos') };
    render(<BlockRenderer blocks={[bloque('uno'), bloque('dos')]} customRegistry={registry} />);

    expect(screen.getByText('bloque uno')).toBeInTheDocument();
    expect(screen.getByText('bloque dos')).toBeInTheDocument();
  });

  it('respeta el orden en que el editor montó los bloques', () => {
    const registry: BlockRegistry = { uno: marcador('primero'), dos: marcador('segundo') };
    const { container } = render(
      <BlockRenderer blocks={[bloque('dos'), bloque('uno')]} customRegistry={registry} />,
    );

    expect(container.textContent).toBe('segundoprimero');
  });

  it('el registry del cliente tiene prioridad sobre el de plataforma', () => {
    const registry: BlockRegistry = { 'rich-text': marcador('versión del cliente') };
    render(<BlockRenderer blocks={[bloque('rich-text')]} customRegistry={registry} />);

    expect(screen.getByText('versión del cliente')).toBeInTheDocument();
  });

  it('cae al registry de plataforma si el cliente no define ese bloque', () => {
    const registry: BlockRegistry = { otro: marcador('otro') };
    const { container } = render(
      <BlockRenderer blocks={[bloque('desconocido')]} customRegistry={registry} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('un bloque desconocido no rompe la página y avisa en desarrollo', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const registry: BlockRegistry = { uno: marcador('bloque uno') };
    render(
      <BlockRenderer blocks={[bloque('uno'), bloque('inventado')]} customRegistry={registry} />,
    );

    expect(screen.getByText('bloque uno')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('inventado'));
  });

  it('en producción no avisa por consola', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<BlockRenderer blocks={[bloque('inventado')]} />);

    expect(warn).not.toHaveBeenCalled();
  });

  it('una página sin bloques no pinta nada', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('BlockRenderer — reparto de slots', () => {
  /** Un bloque que pinta lo que le llegue por el slot `aside`. */
  function ConSlot({ data, aside }: { data: unknown; aside?: ReactNode }) {
    return (
      <div>
        <span>{(data as { id: string }).id}</span>
        {aside}
      </div>
    );
  }

  const registry = { prueba: ConSlot };
  const slots = { 'el-primero': { aside: <b>desde el site</b> } };

  // Sin esto, un override tendría que aplicarse a todas las instancias del
  // bloque en lugar de a la que el editor eligió.
  it('entrega el slot solo a la instancia con ese slotId', () => {
    const { container } = render(
      <BlockRenderer
        blocks={[
          { blockType: 'prueba', id: 'a', slotId: 'el-primero' },
          { blockType: 'prueba', id: 'b' },
        ]}
        customRegistry={registry}
        slotRegistry={slots}
      />,
    );

    expect(container.querySelectorAll('b')).toHaveLength(1);
    expect(container.textContent).toContain('desde el site');
  });

  it('un slotId sin entrada en el registry no rompe nada', () => {
    const { container } = render(
      <BlockRenderer
        blocks={[{ blockType: 'prueba', id: 'a', slotId: 'inventado' }]}
        customRegistry={registry}
        slotRegistry={slots}
      />,
    );

    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toContain('a');
  });

  it('sin slotRegistry el renderer sigue funcionando', () => {
    const { container } = render(
      <BlockRenderer
        blocks={[{ blockType: 'prueba', id: 'a', slotId: 'el-primero' }]}
        customRegistry={registry}
      />,
    );

    expect(container.querySelector('b')).toBeNull();
  });
});
