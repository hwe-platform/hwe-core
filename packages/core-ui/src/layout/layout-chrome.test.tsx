import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { BottomBookingWidget } from './BottomBookingWidget';
import { FloatingActions } from './FloatingActions';
import { SecondaryNav } from './SecondaryNav';
import { SiteLayout } from './SiteLayout';
import { Footer } from './Footer';

import type { FooterData } from '../schemas/globals/footer.types';
import type { HeaderData } from '../schemas/globals/header.types';
import type { SiteConfigData } from '../schemas/globals/site-config.types';
import type { SiteGlobals } from './SiteLayout';

afterEach(() => vi.restoreAllMocks());

/** Simula que la página se ha desplazado y dispara el evento. */
function scrollA(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

const header: HeaderData = {
  topBar: { links: [], showLogin: false, bookingButtonLabel: 'Réserver' },
  navigation: [{ label: 'Le Camping', url: '/le-camping' }],
};

describe('SecondaryNav — comportamiento sticky', () => {
  it('es relativa arriba del todo y pasa a fija al hacer scroll', () => {
    const { container } = render(<SecondaryNav data={header} siteName="La Civelle" />);
    const nav = container.querySelector('nav');

    expect(nav?.className).toContain('relative');

    scrollA(120);
    expect(nav?.className).toContain('fixed');

    scrollA(0);
    expect(nav?.className).toContain('relative');
  });

  it('el envoltorio reserva la altura para que el contenido no salte', () => {
    const { container } = render(<SecondaryNav data={header} siteName="La Civelle" />);
    expect(container.firstElementChild?.className).toContain('h-16');
  });
});

describe('BottomBookingWidget', () => {
  it('arranca plegado y muestra la etiqueta de abrir', () => {
    render(
      <BottomBookingWidget
        openLabel="Réserver votre séjour"
        closeLabel="Fermer"
        searchLabel="Rechercher"
      />,
    );
    expect(screen.getByRole('button', { name: /Réserver votre séjour/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('link', { name: 'Rechercher' })).not.toBeInTheDocument();
  });

  it('se despliega y se repliega', () => {
    render(
      <BottomBookingWidget
        openLabel="Réserver votre séjour"
        closeLabel="Fermer"
        searchLabel="Rechercher"
      />,
    );
    const pestana = screen.getByRole('button');

    fireEvent.click(pestana);
    expect(screen.getByRole('link', { name: 'Rechercher' })).toBeInTheDocument();
    expect(pestana).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(pestana);
    expect(screen.queryByRole('link', { name: 'Rechercher' })).not.toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <BottomBookingWidget openLabel="Abrir" closeLabel="Cerrar" searchLabel="Buscar" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('FloatingActions', () => {
  it('el botón de volver arriba solo aparece tras recorrer la página', () => {
    render(<FloatingActions />);
    expect(screen.queryByRole('button', { name: 'Volver arriba' })).not.toBeInTheDocument();

    scrollA(600);
    expect(screen.getByRole('button', { name: 'Volver arriba' })).toBeInTheDocument();
  });

  it('vuelve arriba al pulsarlo', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, writable: true });

    render(<FloatingActions />);
    scrollA(600);
    fireEvent.click(screen.getByRole('button', { name: 'Volver arriba' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('solo pinta el chat si se le da una etiqueta', () => {
    const { rerender } = render(<FloatingActions />);
    expect(screen.queryByRole('button', { name: 'Abrir el chat' })).not.toBeInTheDocument();

    rerender(<FloatingActions chatLabel="Abrir el chat" />);
    expect(screen.getByRole('button', { name: 'Abrir el chat' })).toBeInTheDocument();
  });
});

const footerConNewsletter: FooterData = {
  virtualAssistant: { enabled: false },
  columns: [
    {
      title: 'Newsletter',
      type: 'newsletter',
      newsletter: {
        description: 'Recevez nos offres',
        buttonLabel: "S'inscrire",
        provider: 'mailchimp',
        actionUrl: 'https://newsletter.example/suscribir',
      },
    },
  ],
  partners: [],
  copyright: '© 2026',
};

const siteConfig = {
  general: {
    siteName: 'Camping La Civelle',
    siteDescription: 'Camping',
    logo: 'media-1',
    logoInverted: 'media-2',
    openingDates: 'Juillet & août',
  },
  contact: {
    address: 'Route de la Plage',
    postalCode: '40130',
    city: 'Capbreton',
    country: 'France',
    phone: '05 58 72 12 34',
    email: 'contact@example.com',
  },
  location: { latitude: 43.64, longitude: -1.43, transport: [] },
  languages: { available: ['fr'], default: 'fr', prefixDefault: false, strategy: 'prefix' },
  social: {},
  payments: [],
  legal: { links: [] },
  tracking: {},
  customCode: [],
  booking: { engine: 'mastercamping' },
} as SiteConfigData;

describe('Footer — columna de newsletter', () => {
  it('pinta la descripción y el botón de suscripción', () => {
    render(<Footer data={footerConNewsletter} config={siteConfig} />);
    expect(screen.getByText('Recevez nos offres')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "S'inscrire" })).toHaveAttribute(
      'href',
      'https://newsletter.example/suscribir',
    );
  });

  it('omite la banda social si no hay redes ni pagos', () => {
    const { container } = render(<Footer data={footerConNewsletter} config={siteConfig} />);
    expect(container.querySelector('a[href*="instagram"]')).toBeNull();
  });
});

const globals: SiteGlobals = {
  siteConfig,
  header,
  footer: footerConNewsletter,
  banner: { enabled: true, message: 'Aviso', type: 'info', dismissible: false },
};

describe('SiteLayout', () => {
  it('compone banner, barra, navegación, contenido y pie', () => {
    render(
      <SiteLayout globals={globals} locale="fr">
        <p>contenido de la página</p>
      </SiteLayout>,
    );

    expect(screen.getByText('Aviso')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Réserver' })).toBeInTheDocument();
    expect(screen.getByText('contenido de la página')).toBeInTheDocument();
    expect(screen.getByText('© 2026')).toBeInTheDocument();
  });

  it('es el dueño del <main>: lo pone una sola vez', () => {
    const { container } = render(
      <SiteLayout globals={globals} locale="fr">
        <p>contenido</p>
      </SiteLayout>,
    );
    expect(container.querySelectorAll('main')).toHaveLength(1);
  });

  it('funciona sin banner configurado', () => {
    render(
      <SiteLayout globals={{ ...globals, banner: undefined }} locale="fr">
        <p>contenido</p>
      </SiteLayout>,
    );
    expect(screen.getByText('contenido')).toBeInTheDocument();
    expect(screen.queryByText('Aviso')).not.toBeInTheDocument();
  });
});
