'use client';

import { useState } from 'react';

import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';

/** Props de {@link BottomBookingWidget}. */
export type BottomBookingWidgetProps = {
  /** Texto de la pestaña cuando está plegado. */
  openLabel: string;
  /** Texto de la pestaña cuando está desplegado. */
  closeLabel: string;
  /** Destino del botón de buscar. */
  searchUrl?: string;
  /** Texto del botón de buscar. */
  searchLabel: string;
};

/**
 * Panel de búsqueda de disponibilidad, fijo al fondo de la ventana.
 *
 * No confundir con el bloque de reservas de una ficha de alojamiento, que es
 * contenido de esa página y muestra precios reales. Este es chrome: acompaña
 * al visitante por todo el site.
 *
 * Los campos son de momento un enlace al motor de reservas. La búsqueda real
 * llega con los adapters de booking, que no son del Hito 1.
 *
 * @example
 * <BottomBookingWidget openLabel="Réserver votre séjour" closeLabel="Fermer" searchLabel="Rechercher" />
 */
export function BottomBookingWidget({
  openLabel,
  closeLabel,
  searchUrl = '/reserver',
  searchLabel,
}: BottomBookingWidgetProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50" aria-label="Buscador de disponibilidad">
      <div className="mx-auto max-w-[1140px] px-4">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="bg-primary text-primary-foreground ml-auto flex items-center gap-2 rounded-t-2xl px-6 py-3 text-sm font-bold"
        >
          {abierto ? closeLabel : openLabel}
          <Icon name="chevronDown" size="sm" className={abierto ? '' : 'rotate-180'} />
        </button>

        {abierto ? (
          <div className="bg-card border-border flex flex-col gap-4 rounded-t-2xl border p-6 shadow-lg md:flex-row md:items-end">
            <p className="text-muted-foreground flex-1 text-sm">
              La búsqueda de disponibilidad se conecta con el motor de reservas del cliente.
            </p>
            <Button href={searchUrl}>{searchLabel}</Button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
