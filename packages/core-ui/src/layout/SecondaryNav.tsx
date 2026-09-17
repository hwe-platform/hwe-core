'use client';

import { useEffect, useState } from 'react';

import { Icon } from '../primitives/Icon';
import { Image } from '../primitives/Image';
import { Link } from '../primitives/Link';
import { cn } from '../lib/cn';

import type { HeaderData } from '../schemas/globals/header.types';

/** A partir de cuántos hijos el desplegable pasa a dos columnas. */
const COLUMNAS_DOBLES_DESDE = 6;

/** Props de {@link SecondaryNav}. */
export type SecondaryNavProps = {
  /** Global `header` de Payload. */
  data: HeaderData;
  /** URL del logo. Sale de `site-config.general.logo`. */
  logoUrl?: string;
  /** Nombre del site, usado como texto alternativo del logo. */
  siteName?: string;
};

type EntradaProps = {
  item: HeaderData['navigation'][number];
  abierta: boolean;
  onAbrir: () => void;
  onCerrar: () => void;
};

/** Una entrada del primer nivel, con su desplegable si tiene hijos. */
function Entrada({ item, abierta, onAbrir, onCerrar }: EntradaProps) {
  const hijos = item.children ?? [];
  const tieneHijos = hijos.length > 0;

  return (
    <li className="relative" onMouseEnter={() => tieneHijos && onAbrir()} onMouseLeave={onCerrar}>
      <Link
        href={item.url}
        className="font-body inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide"
        aria-expanded={tieneHijos ? abierta : undefined}
      >
        {item.label}
        {tieneHijos ? <Icon name="chevronDown" size="sm" /> : null}
      </Link>

      {tieneHijos && abierta ? (
        <ul
          className={cn(
            'bg-card border-border absolute left-0 top-full z-50 grid gap-1 rounded-b-2xl border p-4 shadow-lg',
            hijos.length > COLUMNAS_DOBLES_DESDE
              ? 'w-[440px] grid-cols-2'
              : 'w-[240px] grid-cols-1',
          )}
        >
          {hijos.map((hijo) => (
            <li key={`${hijo.url}-${hijo.label}`}>
              <Link href={hijo.url} className="hover:bg-muted block rounded-lg px-3 py-2 text-sm">
                {hijo.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** Logo del site, o su nombre si no hay imagen configurada. */
function Marca({ logoUrl, siteName }: { logoUrl?: string; siteName?: string }) {
  return (
    <Link href="/" className="shrink-0">
      {logoUrl ? (
        <Image src={logoUrl} alt={siteName ?? 'Inicio'} width={140} height={40} />
      ) : (
        <span className="font-heading font-bold">{siteName}</span>
      )}
    </Link>
  );
}

/**
 * Navegación principal, fija al hacer scroll.
 *
 * Admite dos niveles: una entrada con `children` se pinta como desplegable. El
 * orden lo controla el editor arrastrando en Payload, sin tocar código.
 *
 * Oculta en móvil — ahí navega `MobileMenu`.
 *
 * @example
 * <SecondaryNav data={header} logoUrl={logo} siteName={config.general.siteName} />
 */
export function SecondaryNav({ data, logoUrl, siteName }: SecondaryNavProps) {
  const [fija, setFija] = useState(false);
  const [abierta, setAbierta] = useState<string | null>(null);

  useEffect(() => {
    const alScroll = () => setFija(window.scrollY > 0);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    // El envoltorio reserva la altura para que el contenido no salte cuando la
    // barra pasa a posición fija.
    <div className="hidden h-16 md:block">
      <nav
        aria-label="Navegación principal"
        className={cn(
          'bg-card border-border z-40 h-16 w-full border-b',
          fija ? 'fixed left-0 right-0 top-10' : 'relative',
        )}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Marca logoUrl={logoUrl} siteName={siteName} />

          <ul className="flex items-center gap-6">
            {data.navigation.map((item) => (
              <Entrada
                key={`${item.url}-${item.label}`}
                item={item}
                abierta={abierta === item.label}
                onAbrir={() => setAbierta(item.label)}
                onCerrar={() => setAbierta(null)}
              />
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
