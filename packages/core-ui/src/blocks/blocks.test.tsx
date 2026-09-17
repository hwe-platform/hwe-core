import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { CtaBlock } from './cta';
import { RichTextBlock } from './rich-text';

const contenido = {
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Bienvenue.', format: 0 }] }],
  },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('RichTextBlock', () => {
  it('pinta el contenido del editor', () => {
    render(<RichTextBlock data={{ blockType: 'rich-text', content: contenido }} />);
    expect(screen.getByText('Bienvenue.')).toBeInTheDocument();
  });

  it('no rompe la página si los datos no son suyos', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<RichTextBlock data={{ blockType: 'otro-bloque' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('avisa en desarrollo cuando los datos no validan', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<RichTextBlock data={{ blockType: 'otro-bloque' }} />);

    expect(error).toHaveBeenCalledWith('[RichTextBlock] datos inválidos', expect.anything());
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <RichTextBlock data={{ blockType: 'rich-text', content: contenido }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

const cta = {
  blockType: 'cta',
  title: 'Réservez votre séjour',
  subtitle: 'Ouvert du 1er avril au 30 septembre',
  links: [
    { label: 'Réserver', url: '/reserver', variant: 'primary' },
    { label: 'Nous contacter', url: '/contact', variant: 'outline' },
  ],
};

describe('CtaBlock', () => {
  it('pinta título, subtítulo y botones', () => {
    render(<CtaBlock data={cta} />);
    expect(screen.getByRole('heading', { name: 'Réservez votre séjour' })).toBeInTheDocument();
    expect(screen.getByText('Ouvert du 1er avril au 30 septembre')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Réserver' })).toHaveAttribute('href', '/reserver');
    expect(screen.getByRole('link', { name: 'Nous contacter' })).toBeInTheDocument();
  });

  it('el título y el subtítulo son opcionales', () => {
    const { container } = render(
      <CtaBlock data={{ blockType: 'cta', links: [{ label: 'Ir', url: '/ir' }] }} />,
    );
    expect(container.querySelector('h2')).toBeNull();
    expect(screen.getByRole('link', { name: 'Ir' })).toBeInTheDocument();
  });

  it('aplica primary por defecto cuando el enlace no dice variante', () => {
    render(<CtaBlock data={{ blockType: 'cta', links: [{ label: 'Ir', url: '/ir' }] }} />);
    expect(screen.getByRole('link', { name: 'Ir' }).className).toContain('bg-primary');
  });

  it('acepta un bloque sin enlaces sin romperse', () => {
    render(<CtaBlock data={{ blockType: 'cta', title: 'Solo título', links: [] }} />);
    expect(screen.getByRole('heading', { name: 'Solo título' })).toBeInTheDocument();
  });

  it('no rompe la página si los datos no son suyos', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<CtaBlock data={{ blockType: 'rich-text' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<CtaBlock data={cta} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
