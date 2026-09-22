import { MarcoIcono } from './ItemIcon';
import { cn } from '../../lib/cn';

import type { IconGridVariantProps } from './icon-grid.types';

/**
 * Iconos sueltos sobre el fondo de la sección, centrados.
 *
 * Es la variante de «Pourquoi choisir La Civelle» y «Nos Engagements». La
 * etiqueta es un `<h3>` en color de acento: aquí sí encabeza su bloque de
 * texto, al revés que en la variante de tarjeta, donde es un rótulo.
 */
export function IconGridBare({ items, amplio, iconRegistry }: IconGridVariantProps) {
  return (
    <>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center">
          <div className={amplio ? 'mb-8' : 'mb-6'}>
            <MarcoIcono nombre={item.icon} iconRegistry={iconRegistry} amplio={amplio} />
          </div>

          <h3 className={cn('text-secondary font-bold', amplio ? 'mb-4 text-2xl' : 'mb-3 text-lg')}>
            {item.label}
          </h3>

          {item.description ? (
            <p
              className={cn(
                'text-muted-foreground leading-relaxed',
                amplio ? 'text-base' : 'text-sm',
              )}
            >
              {item.description}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}
