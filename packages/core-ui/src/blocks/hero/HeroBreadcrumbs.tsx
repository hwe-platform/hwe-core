import { Icon } from '../../primitives/Icon';
import { Link } from '../../primitives/Link';

import type { Breadcrumb } from './hero.types';

/**
 * Rastro de migas del hero.
 *
 * **Vive aquí y no en el layout** porque en el diseño va dentro de la cabecera
 * de cada página, sobre la imagen, no en la barra de navegación.
 *
 * El separador es un chevron en color de acento; los niveles anteriores van en
 * crema atenuado y el actual, a plena opacidad y sin enlace.
 */
export function HeroBreadcrumbs({ items, label }: { items: Breadcrumb[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6 self-start">
      <ol className="flex items-center gap-2">
        {items.map((item, indice) => {
          const ultimo = indice === items.length - 1;
          return (
            <li key={`${item.url ?? ''}-${item.label}`} className="flex items-center gap-2">
              {indice > 0 ? (
                <Icon name="chevronRight" size="xs" className="text-secondary h-3 w-3" />
              ) : null}
              {item.url && !ultimo ? (
                <Link
                  href={item.url}
                  className="text-primary-foreground/70 font-body hover:text-primary-foreground text-[12px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={ultimo ? 'page' : undefined}
                  className="text-primary-foreground font-body text-[12px]"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
