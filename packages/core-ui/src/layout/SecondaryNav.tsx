'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Icon } from '../primitives/Icon';
import { Image } from '../primitives/Image';
import { Link } from '../primitives/Link';
import { cn } from '../lib/cn';

import type { HeaderData } from '../schemas/globals/header.types';

/** A partir de cuántos hijos el desplegable pasa a dos columnas. */
const COLUMNAS_DOBLES_DESDE = 6;

/**
 * A partir de qué posición el desplegable se alinea a la derecha.
 *
 * Las últimas entradas de la barra quedan cerca del borde y un desplegable
 * alineado a la izquierda se saldría de la pantalla.
 */
const ALINEA_DERECHA_DESDE = 6;

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
  activa: boolean;
  alineaDerecha: boolean;
  abierta: boolean;
  onAbrir: () => void;
  onCerrar: () => void;
};

/** Una entrada del primer nivel, con su desplegable si tiene hijos. */
function Entrada({ item, activa, alineaDerecha, abierta, onAbrir, onCerrar }: EntradaProps) {
  const hijos = item.children ?? [];
  const tieneHijos = hijos.length > 0;

  return (
    <li
      className="group relative flex h-full items-center"
      onMouseEnter={() => tieneHijos && onAbrir()}
      onMouseLeave={onCerrar}
    >
      <Link
        href={item.url}
        aria-current={activa ? 'page' : undefined}
        aria-expanded={tieneHijos ? abierta : undefined}
        className={cn(
          'font-body relative inline-flex h-full items-center gap-1.5 whitespace-nowrap px-2',
          'text-[11px] font-bold uppercase tracking-[1.16px]',
          activa ? 'text-primary' : 'text-foreground hover:text-primary',
        )}
      >
        {item.label}
        {tieneHijos ? <Icon name="chevronDown" size="xs" className="h-3 w-3" /> : null}

        {/* Subrayado dorado: marca la sección activa y se insinúa al pasar por
            encima. Va dentro del enlace para heredar su anchura. */}
        <span
          aria-hidden
          className={cn(
            'absolute bottom-0 left-2 right-2 h-0.5',
            activa ? 'bg-secondary' : 'group-hover:bg-secondary/50 bg-transparent',
          )}
        />
      </Link>

      {tieneHijos && abierta ? <Desplegable hijos={hijos} alineaDerecha={alineaDerecha} /> : null}
    </li>
  );
}

/** El menú de segundo nivel que cuelga de una entrada. */
function Desplegable({
  hijos,
  alineaDerecha,
}: {
  hijos: NonNullable<HeaderData['navigation'][number]['children']>;
  alineaDerecha: boolean;
}) {
  return (
    // El padding superior mantiene el puntero dentro de la entrada al bajar del
    // enlace al desplegable; sin él, el menú se cierra por el camino.
    <div
      className={cn(
        'absolute top-full z-50 min-w-[220px] pt-2',
        alineaDerecha ? 'right-0' : 'left-0',
      )}
    >
      <ul
        className={cn(
          'bg-background border-border overflow-hidden rounded-2xl border py-3 shadow-2xl',
          hijos.length > COLUMNAS_DOBLES_DESDE ? 'grid w-[440px] grid-cols-2' : 'flex flex-col',
        )}
      >
        {hijos.map((hijo) => (
          <li key={`${hijo.url}-${hijo.label}`}>
            <Link
              href={hijo.url}
              className="text-muted-foreground font-body hover:text-primary hover:bg-primary/5 hover:border-secondary block border-l-2 border-transparent px-5 py-3 text-[12px] font-medium"
            >
              {hijo.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Logo del site, o su nombre si no hay imagen configurada. */
function Marca({ logoUrl, siteName }: { logoUrl?: string; siteName?: string }) {
  return (
    <Link href="/" className="mr-8 flex shrink-0 items-center" aria-label={siteName ?? 'Inicio'}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={siteName ?? 'Inicio'}
          width={140}
          height={32}
          className="h-8 w-auto"
        />
      ) : (
        <span className="font-heading font-bold">{siteName}</span>
      )}
    </Link>
  );
}

/**
 * Comprueba si una entrada corresponde a la página que se está viendo.
 *
 * Compara sin el prefijo de idioma y admite las rutas hijas, para que
 * `/le-camping/piscine` siga marcando `Le Camping`.
 */
function esRutaActiva(url: string, pathname: string | null): boolean {
  if (!pathname || url === '#') return false;
  const sinIdioma = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  if (url === '/') return sinIdioma === '/';
  return sinIdioma === url || sinIdioma.startsWith(`${url}/`);
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
  const pathname = usePathname();

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
          'bg-background border-border z-40 h-16 w-full border-b',
          fija ? 'fixed left-0 right-0 top-10 shadow-lg' : 'relative',
        )}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Marca logoUrl={logoUrl} siteName={siteName} />

          <ul className="flex h-full items-center gap-1 xl:gap-7">
            {data.navigation.map((item, indice) => (
              <Entrada
                key={`${item.url}-${item.label}`}
                item={item}
                activa={esRutaActiva(item.url, pathname)}
                alineaDerecha={indice >= ALINEA_DERECHA_DESDE}
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
