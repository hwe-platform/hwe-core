import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Image } from './Image';

describe('Image', () => {
  it('renderiza el alt pasado', () => {
    render(<Image src="/foto.jpg" alt="Mobile home vista exterior" width={800} height={600} />);
    expect(screen.getByAltText('Mobile home vista exterior')).toBeInTheDocument();
  });

  it.each(['16/9', '4/3', '1/1', '3/4'] as const)(
    'renderiza el aspect ratio %s dentro de un contenedor',
    (aspectRatio) => {
      const { container } = render(<Image src="/foto.jpg" alt="Foto" aspectRatio={aspectRatio} />);
      expect(container.querySelector('img')).toBeInTheDocument();
    },
  );

  it('activa el placeholder blur cuando se pide y hay blurDataURL', () => {
    render(
      <Image
        src="/foto.jpg"
        alt="Foto"
        width={800}
        height={600}
        showBlurPlaceholder
        blurDataURL="data:image/png;base64,abc"
      />,
    );
    expect(screen.getByAltText('Foto')).toHaveAttribute('placeholder', 'blur');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <Image src="/foto.jpg" alt="Mobile home vista exterior" width={800} height={600} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
