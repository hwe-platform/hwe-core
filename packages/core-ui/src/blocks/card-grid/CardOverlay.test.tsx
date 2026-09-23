import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CardOverlay } from './CardOverlay';

/**
 * La tarjeta con texto sobre la imagen, pintada sin su bloque.
 *
 * El bloque valida con Zod antes de pintar, así que los respaldos de la
 * tabla de escalas no se alcanzan desde ahí. Sí se alcanzan desde un
 * override del site, que es donde esta prueba los cubre.
 */

const item = {
  image: { id: 1, url: '/media/emplacements.png', alt: 'Emplacements' },
  title: 'Nos Emplacements',
  variant: 'link',
};

describe('CardOverlay', () => {
  it('sin escala pinta la de «Nos Hébergements»', () => {
    const { container } = render(<CardOverlay item={item} />);

    expect(container.querySelector('.h-\\[360px\\]')).toBeTruthy();
  });

  it('una escala fuera de tabla cae a la de por defecto', () => {
    const { container } = render(<CardOverlay item={item} size="inventada" />);

    expect(container.querySelector('.h-\\[360px\\]')).toBeTruthy();
  });

  it('la escala compacta baja el marco, el relleno y el titular', () => {
    const { container } = render(<CardOverlay item={item} size="compact" />);

    expect(container.querySelector('.h-\\[320px\\]')).toBeTruthy();
    expect(container.querySelector('h3')?.className).toContain('text-2xl');
  });
});
