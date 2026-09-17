'use client';

import { Icon, ICON_NAMES } from '../primitives/Icon';
import { Link } from '../primitives/Link';
import { Button } from '../primitives/Button';

import type { IconName } from '../primitives/Icon';
import type { HeaderData } from '../schemas/globals/header.types';

/**
 * Icono con el que se pinta un enlace del `topBar`.
 *
 * Los valores del schema (`help`, `phone`, `video`, `user`) existen en el set
 * de la primitiva. `custom` no tiene dibujo propio a propósito: significa
 * "algo que el cliente definirá", y hasta entonces se pinta una flecha.
 */
function iconoDeEnlace(nombre: string): IconName {
  return ICON_NAMES.includes(nombre as IconName) ? (nombre as IconName) : 'chevronRight';
}

/** Props de {@link TopBar}. */
export type TopBarProps = {
  /** Global `header` de Payload. */
  data: HeaderData;
  /** Idiomas disponibles y el activo, para el selector. */
  locales?: { available: readonly string[]; current: string };
  /** Abre el menú móvil. Lo gestiona quien compone el layout. */
  onOpenMenu?: () => void;
};

/**
 * Barra utilitaria fija en la parte superior.
 *
 * En escritorio muestra los enlaces de servicio, el selector de idioma y el
 * botón de reservar. En móvil se reduce al botón de menú y al de reservar: el
 * resto vive dentro del menú lateral.
 *
 * @example
 * <TopBar data={header} locales={{ available: ['fr','en'], current: 'fr' }} />
 */
export function TopBar({ data, locales, onOpenMenu }: TopBarProps) {
  const { topBar } = data;

  return (
    <div className="bg-primary text-primary-foreground fixed left-0 right-0 top-0 z-50 h-12 md:h-10">
      <nav
        aria-label="Enlaces de servicio"
        className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir el menú"
          className="rounded-lg p-1 md:hidden"
        >
          <Icon name="menu" size="sm" />
        </button>

        <ul className="hidden items-center gap-6 text-sm md:flex">
          {topBar.links.map((link) => (
            <li key={`${link.url}-${link.label}`}>
              <Link href={link.url} className="inline-flex items-center gap-2 hover:opacity-80">
                <Icon name={iconoDeEnlace(link.icon)} size="sm" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {locales && locales.available.length > 1 ? (
            <span className="hidden text-sm font-bold uppercase md:inline">{locales.current}</span>
          ) : null}

          <Button href="/reserver" variant="secondary" size="sm">
            {topBar.bookingButtonLabel}
          </Button>
        </div>
      </nav>
    </div>
  );
}
