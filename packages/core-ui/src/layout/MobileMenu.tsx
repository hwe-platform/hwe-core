'use client';

import { useEffect, useState } from 'react';

import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Link } from '../primitives/Link';

import type { HeaderData } from '../schemas/globals/header.types';

/** Props de {@link MobileMenu}. */
export type MobileMenuProps = {
  /** Global `header` de Payload. */
  data: HeaderData;
  /** Si el panel está visible. Lo controla quien compone el layout. */
  open: boolean;
  /** Cierra el panel. */
  onClose: () => void;
};

type EntradaProps = {
  item: HeaderData['navigation'][number];
  abierta: boolean;
  onAlternar: () => void;
  onNavegar: () => void;
};

/**
 * Una entrada del menú. Con hijos se comporta como acordeón; sin ellos, como
 * enlace directo.
 */
function Entrada({ item, abierta, onAlternar, onNavegar }: EntradaProps) {
  const hijos = item.children ?? [];

  if (hijos.length === 0) {
    return (
      <li>
        <Link href={item.url} className="font-body block py-3 font-medium" onClick={onNavegar}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={onAlternar}
        aria-expanded={abierta}
        className="font-body flex w-full items-center justify-between py-3 text-left font-medium"
      >
        {item.label}
        <Icon name={abierta ? 'chevronDown' : 'chevronRight'} size="sm" />
      </button>

      {abierta ? (
        <ul className="border-border ml-3 flex flex-col gap-1 border-l pl-3">
          {hijos.map((hijo) => (
            <li key={`${hijo.url}-${hijo.label}`}>
              <Link href={hijo.url} className="block py-2 text-sm" onClick={onNavegar}>
                {hijo.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * Menú de navegación para móvil, en panel lateral.
 *
 * Mismas entradas que `SecondaryNav`, pero los desplegables se abren en
 * acordeón en lugar de al pasar el ratón — en una pantalla táctil no hay
 * "pasar por encima".
 *
 * Bloquea el scroll del documento mientras está abierto, para que el fondo no
 * se desplace al arrastrar dentro del panel.
 *
 * @example
 * <MobileMenu data={header} open={abierto} onClose={() => setAbierto(false)} />
 */
export function MobileMenu({ data, open, onClose }: MobileMenuProps) {
  const [desplegada, setDesplegada] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alPulsarEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alPulsarEscape);

    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener('keydown', alPulsarEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="z-100 fixed inset-0 md:hidden">
      <button
        type="button"
        aria-label="Cerrar el menú"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <Panel data={data} desplegada={desplegada} onDesplegar={setDesplegada} onClose={onClose} />
    </div>
  );
}

type PanelProps = {
  data: HeaderData;
  desplegada: string | null;
  onDesplegar: (label: string | null) => void;
  onClose: () => void;
};

/** Panel lateral con la navegación, los enlaces de servicio y el CTA. */
function Panel({ data, desplegada, onDesplegar, onClose }: PanelProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="bg-card absolute right-0 top-0 flex h-full w-[300px] flex-col overflow-y-auto p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar el menú"
        className="mb-6 self-end rounded-lg p-1"
      >
        <Icon name="x" />
      </button>

      <ul className="flex flex-col gap-1">
        {data.navigation.map((item) => (
          <Entrada
            key={`${item.url}-${item.label}`}
            item={item}
            abierta={desplegada === item.label}
            onAlternar={() => onDesplegar(desplegada === item.label ? null : item.label)}
            onNavegar={onClose}
          />
        ))}
      </ul>

      <ul className="border-border mt-6 flex flex-col gap-1 border-t pt-6">
        {data.topBar.links.map((link) => (
          <li key={`${link.url}-${link.label}`}>
            <Link href={link.url} className="block py-2 text-sm" onClick={onClose}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Button href="/reserver" variant="secondary" className="mt-6">
        {data.topBar.bookingButtonLabel}
      </Button>
    </nav>
  );
}
