import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { Banner } from './Banner';
import { TopBar } from './TopBar';
import { SecondaryNav } from './SecondaryNav';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';

import type { BannerData } from '../schemas/globals/banner.types';
import type { FooterData } from '../schemas/globals/footer.types';
import type { HeaderData } from '../schemas/globals/header.types';
import type { SiteConfigData } from '../schemas/globals/site-config.types';

afterEach(() => vi.restoreAllMocks());

const banner: BannerData = {
  enabled: true,
  message: 'Ouvert juillet & août',
  type: 'info',
  dismissible: true,
};

const header: HeaderData = {
  topBar: {
    links: [
      { label: 'Aide', icon: 'help', url: '/aide' },
      { label: 'Contact', icon: 'phone', url: '/contact' },
    ],
    showLogin: false,
    bookingButtonLabel: 'Réserver',
  },
  navigation: [
    { label: 'Le Camping', url: '/le-camping' },
    {
      label: 'Nos Locations',
      url: '/locations',
      children: [
        { label: 'Mobile Home Confort', url: '/locations/mobile-home' },
        { label: 'Cottage Premium', url: '/locations/cottage' },
      ],
    },
  ],
};

describe('Banner', () => {
  it('no se pinta si está desactivado', () => {
    const { container } = render(<Banner data={{ ...banner, enabled: false }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra el mensaje cuando está activo', () => {
    render(<Banner data={banner} />);
    expect(screen.getByText('Ouvert juillet & août')).toBeInTheDocument();
  });

  it('se puede cerrar si es dismissible', async () => {
    render(<Banner data={banner} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el aviso' }));
    expect(screen.queryByText('Ouvert juillet & août')).not.toBeInTheDocument();
  });

  it('no ofrece cerrar si no es dismissible', () => {
    render(<Banner data={{ ...banner, dismissible: false }} />);
    expect(screen.queryByRole('button', { name: 'Cerrar el aviso' })).not.toBeInTheDocument();
  });

  it('enlaza el mensaje si hay url', () => {
    render(<Banner data={{ ...banner, url: '/aviso' }} />);
    expect(screen.getByRole('link', { name: 'Ouvert juillet & août' })).toHaveAttribute(
      'href',
      '/aviso',
    );
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Banner data={banner} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TopBar', () => {
  it('pinta los enlaces de servicio y el botón de reservar', () => {
    render(<TopBar data={header} />);
    expect(screen.getByRole('link', { name: /Aide/ })).toHaveAttribute('href', '/aide');
    expect(screen.getByRole('link', { name: 'Réserver' })).toBeInTheDocument();
  });

  it('avisa a quien compone el layout para abrir el menú', async () => {
    const abrir = vi.fn();
    render(<TopBar data={header} onOpenMenu={abrir} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir el menú' }));
    expect(abrir).toHaveBeenCalledOnce();
  });

  it('solo muestra el idioma si hay más de uno', () => {
    const { rerender } = render(
      <TopBar data={header} locales={{ available: ['fr'], current: 'fr' }} />,
    );
    expect(screen.queryByText('fr')).not.toBeInTheDocument();

    rerender(<TopBar data={header} locales={{ available: ['fr', 'en'], current: 'fr' }} />);
    expect(screen.getByText('fr')).toBeInTheDocument();
  });
});

describe('SecondaryNav', () => {
  it('pinta las entradas de navegación', () => {
    render(<SecondaryNav data={header} siteName="Camping La Civelle" />);
    expect(screen.getByRole('link', { name: 'Le Camping' })).toHaveAttribute('href', '/le-camping');
  });

  it('el desplegable solo aparece al pasar por encima', async () => {
    render(<SecondaryNav data={header} siteName="La Civelle" />);
    expect(screen.queryByRole('link', { name: 'Cottage Premium' })).not.toBeInTheDocument();

    fireEvent.mouseOver(screen.getByRole('link', { name: /Nos Locations/ }));
    expect(screen.getByRole('link', { name: 'Cottage Premium' })).toBeInTheDocument();
  });

  it('usa el nombre del site como texto si no hay logo', () => {
    render(<SecondaryNav data={header} siteName="Camping La Civelle" />);
    expect(screen.getByText('Camping La Civelle')).toBeInTheDocument();
  });
});

describe('MobileMenu', () => {
  it('no se pinta si está cerrado', () => {
    const { container } = render(<MobileMenu data={header} open={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('despliega los hijos en acordeón al pulsar, no al pasar por encima', async () => {
    render(<MobileMenu data={header} open onClose={vi.fn()} />);
    expect(screen.queryByRole('link', { name: 'Cottage Premium' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Nos Locations/ }));
    expect(screen.getByRole('link', { name: 'Cottage Premium' })).toBeInTheDocument();
  });

  it('se cierra al navegar, para no dejar el panel encima de la página', async () => {
    const cerrar = vi.fn();
    render(<MobileMenu data={header} open onClose={cerrar} />);
    fireEvent.click(screen.getByRole('link', { name: 'Le Camping' }));
    expect(cerrar).toHaveBeenCalledOnce();
  });

  it('se cierra con Escape', async () => {
    const cerrar = vi.fn();
    render(<MobileMenu data={header} open onClose={cerrar} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(cerrar).toHaveBeenCalledOnce();
  });

  it('bloquea el scroll del fondo mientras está abierto', () => {
    const { unmount } = render(<MobileMenu data={header} open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

const footer: FooterData = {
  virtualAssistant: { enabled: true, title: 'Assistant virtuel', subtitle: 'Une question ?' },
  columns: [
    {
      title: 'Plan du site',
      type: 'links',
      links: [{ label: 'Le Camping', url: '/le-camping' }],
    },
  ],
  partners: [{ name: 'Écolabel', logo: 'media-1' }],
  copyright: '© 2026 Camping La Civelle',
};

const siteConfig = {
  general: {
    siteName: 'Camping La Civelle',
    siteDescription: 'Camping à Capbreton',
    logo: 'media-1',
    logoInverted: 'media-2',
    openingDates: '1er avril au 30 septembre',
  },
  contact: {
    address: 'Route de la Plage',
    postalCode: '40130',
    city: 'Capbreton',
    country: 'France',
    phone: '05 58 72 12 34',
    email: 'contact@camping-lacivelle.com',
  },
  location: { latitude: 43.64, longitude: -1.43, transport: [] },
  languages: { available: ['fr', 'en'], default: 'fr', prefixDefault: false, strategy: 'prefix' },
  social: { instagram: 'https://instagram.com/lacivelle' },
  payments: ['CB', 'Visa'],
  legal: { links: [{ label: 'CGV', url: '/cgv' }] },
  tracking: {},
  customCode: [],
  booking: { engine: 'mastercamping' },
} as SiteConfigData;

describe('Footer', () => {
  it('pinta las columnas de enlaces', () => {
    render(<Footer data={footer} config={siteConfig} />);
    expect(screen.getByRole('heading', { name: 'Plan du site' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Le Camping' })).toBeInTheDocument();
  });

  it('lee redes, pagos y legales de site-config, no del propio footer', () => {
    render(<Footer data={footer} config={siteConfig} />);
    expect(screen.getByRole('link', { name: 'instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/lacivelle',
    );
    expect(screen.getByText('CB · Visa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CGV' })).toBeInTheDocument();
  });

  it('oculta el asistente virtual si está desactivado', () => {
    render(
      <Footer data={{ ...footer, virtualAssistant: { enabled: false } }} config={siteConfig} />,
    );
    expect(screen.queryByText('Assistant virtuel')).not.toBeInTheDocument();
  });

  it('cae al nombre del partner si su logo no viene poblado', () => {
    render(<Footer data={footer} config={siteConfig} />);
    expect(screen.getByText('Écolabel')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Footer data={footer} config={siteConfig} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
