import { Icon, ICON_NAMES } from '../../primitives/Icon';
import { cn } from '../../lib/cn';

import type { IconName } from '../../primitives/Icon';
import type { IconRegistry } from './icon-grid.types';

/** Trazo fino del diseño. Lucide dibuja a 2 por defecto, que aquí pesa. */
const TRAZO = 1.2;

/** Icono de respaldo cuando el nombre no lo conoce nadie. */
const RESPALDO: IconName = 'check';

export type ItemIconProps = {
  /** Nombre tal como lo guardó el editor. */
  nombre: string;
  /** Iconos propios del site, que tienen prioridad sobre el set de plataforma. */
  iconRegistry?: IconRegistry;
  /** Si el marco es el grande. */
  amplio: boolean;
};

/**
 * El icono de un item, resuelto en tres pasos.
 *
 * Primero el registro del site, después el set de la primitiva `Icon`, y si
 * ninguno lo conoce, un respaldo genérico. El orden importa: un cliente tiene
 * que poder sustituir un icono de plataforma por el suyo sin pedir permiso.
 *
 * **No revienta nunca.** El nombre lo escribe un editor en un panel, y una
 * errata no puede tumbar la página — solo avisa en desarrollo.
 */
export function ItemIcon({ nombre, iconRegistry, amplio }: ItemIconProps) {
  const clases = cn('text-primary', amplio ? 'h-10 w-10' : 'h-8 w-8');
  const Propio = iconRegistry?.[nombre];

  if (Propio) return <Propio className={clases} />;

  if (ICON_NAMES.includes(nombre as IconName)) {
    return (
      <Icon name={nombre as IconName} className={clases} strokeWidth={TRAZO} aria-hidden={true} />
    );
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
    console.warn(`IconGrid: icono desconocido "${nombre}". Se pinta el de respaldo.`);
  }

  return <Icon name={RESPALDO} className={clases} strokeWidth={TRAZO} aria-hidden={true} />;
}

/**
 * El marco circular que envuelve al icono.
 *
 * El círculo va como capa aparte y no como borde del contenedor porque en el
 * diseño el icono se centra dentro de un anillo del que no depende su tamaño.
 */
export function MarcoIcono({ nombre, iconRegistry, amplio }: ItemIconProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        amplio ? 'h-24 w-24' : 'h-20 w-20',
      )}
    >
      <div aria-hidden className="border-border absolute inset-0 rounded-full border" />
      <div className="relative z-10">
        <ItemIcon nombre={nombre} iconRegistry={iconRegistry} amplio={amplio} />
      </div>
    </div>
  );
}
