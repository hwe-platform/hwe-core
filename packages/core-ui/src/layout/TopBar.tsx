'use client';

import { Icon, ICON_NAMES } from '../primitives/Icon';
import { Image } from '../primitives/Image';
import { Link } from '../primitives/Link';

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

/**
 * Botón de reserva de la barra superior.
 *
 * No usa la primitiva `Button` porque su escala es la del chrome, no la del
 * contenido: 11px en versalitas apretadas y 28px de alto, por debajo del
 * tamaño `sm` del sistema. Ver docs/lenguaje-visual.md, "Botón de acento".
 */
const CLASES_BOTON_RESERVA =
  'bg-secondary text-secondary-foreground font-body flex h-8 items-center justify-center ' +
  'rounded px-4 text-[10px] font-bold uppercase tracking-[1.2px] ' +
  'hover:opacity-90 md:h-7 md:px-6 md:text-[11px]';

/** Los enlaces de servicio de la izquierda. Solo en escritorio. */
function EnlacesDeServicio({ links }: { links: HeaderData['topBar']['links'] }) {
  return (
    <nav aria-label="Enlaces de servicio" className="hidden md:block">
      <ul className="flex items-center gap-6">
        {links.map((link) => (
          <li key={`${link.url}-${link.label}`}>
            <Link
              href={link.url}
              className="text-muted-foreground font-body hover:text-primary inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide"
            >
              <Icon name={iconoDeEnlace(link.icon)} size="xs" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Props de {@link TopBar}. */
export type TopBarProps = {
  /** Global `header` de Payload. */
  data: HeaderData;
  /** Idiomas disponibles y el activo, para el selector. */
  locales?: { available: readonly string[]; current: string };
  /** Abre el menú móvil. Lo gestiona quien compone el layout. */
  onOpenMenu?: () => void;
  /** Logo en su versión para fondo claro. Sale de `site-config.general.logo`. */
  logoUrl?: string;
  /** Nombre del site, usado como texto alternativo del logo. */
  siteName?: string;
};

/**
 * Barra utilitaria fija en la parte superior.
 *
 * Va sobre el fondo de página, no sobre el color de marca: es una barra de
 * servicio, y su peso visual tiene que quedar por debajo del de la navegación.
 * En escritorio muestra los enlaces de servicio, el selector de idioma y el
 * botón de reservar; en móvil se reduce al logo y al botón de menú, porque el
 * resto vive dentro del menú lateral.
 *
 * @example
 * <TopBar data={header} locales={{ available: ['fr','en'], current: 'fr' }} />
 */
export function TopBar({ data, locales, onOpenMenu, logoUrl, siteName }: TopBarProps) {
  const { topBar } = data;

  return (
    <div className="bg-background border-border fixed left-0 right-0 top-0 z-[60] h-12 border-b md:h-10">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <EnlacesDeServicio links={topBar.links} />

        {/* El logo solo aparece aquí en móvil: en escritorio lo lleva la
            navegación, que en esa anchura siempre está visible. */}
        <div className="md:hidden">
          {logoUrl ? (
            <Link href="/">
              <Image src={logoUrl} alt={siteName ?? 'Inicio'} width={112} height={28} />
            </Link>
          ) : null}
        </div>

        <div className="flex h-full items-center gap-2 md:gap-0">
          {locales && locales.available.length > 1 ? (
            <span className="text-muted-foreground font-body flex items-center gap-1.5 px-3 text-[13px] font-medium uppercase md:px-4 md:text-[11px]">
              {locales.current}
              <Icon name="chevronDown" size="xs" className="h-3 w-3" />
            </span>
          ) : null}

          <div className="bg-border hidden h-4 w-px md:block" />

          <div className="hidden py-1.5 pl-3 md:block md:pl-4">
            <Link href="/reserver" className={CLASES_BOTON_RESERVA}>
              {topBar.bookingButtonLabel}
            </Link>
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir el menú"
            className="text-primary -mr-2 p-2 md:hidden"
          >
            <Icon name="menu" size="md" />
          </button>
        </div>
      </div>
    </div>
  );
}
