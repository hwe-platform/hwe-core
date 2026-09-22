import { Button } from '../primitives/Button';
import { Eyebrow } from '../primitives/Eyebrow';
import { Icon, ICON_NAMES } from '../primitives/Icon';
import { cn } from '../lib/cn';

import type { z } from 'zod';
import type { IconName } from '../primitives/Icon';
import type { blockLinkSchema } from '../schemas/collections/pages.schema';

/**
 * Piezas que comparten los bloques de sección.
 *
 * Nacieron dentro de `media-text` y se extraen aquí porque `icon-grid` las
 * necesita igual y `card-grid` y `blog` vienen detrás: es la regla de
 * `codigo.md` de extraer cuando aparece la tercera copia, aplicada justo
 * antes de que aparezca.
 */

/**
 * Fondo de la sección.
 *
 * Las secciones alternan para separarse entre sí; `none` deja ver el color de
 * página, que es lo que hace una de las siete del diseño de referencia.
 */
const FONDOS: Record<string, string> = {
  default: 'bg-card',
  muted: 'bg-muted/40',
  none: '',
};

/** Clase de fondo de una sección, vacía si el valor no está en la tabla. */
export function fondoDe(background: string): string {
  return FONDOS[background] ?? '';
}

/** Un enlace de sección, tal como lo declara el schema compartido. */
export type BlockLink = z.infer<typeof blockLinkSchema>;

export type BlockCtasProps = {
  ctas: BlockLink[];
  /** Separación superior. Cambia según lo que haya encima. */
  className?: string;
};

/**
 * Los botones de una sección.
 *
 * Si la lista viene vacía no pinta nada, así que el bloque que lo use no
 * necesita comprobarlo.
 */
export function BlockCtas({ ctas, className }: BlockCtasProps) {
  if (ctas.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {ctas.map((cta) => {
        // Un icono que el set no conoce no se pinta: el editor escribe el
        // nombre a mano y no debe poder romper la página con una errata.
        const icono = ICON_NAMES.includes(cta.icon as IconName)
          ? (cta.icon as IconName)
          : undefined;

        return (
          <Button key={`${cta.url}-${cta.label}`} href={cta.url} variant={cta.variant}>
            {cta.label}
            {icono ? <Icon name={icono} size="sm" /> : null}
          </Button>
        );
      })}
    </div>
  );
}

export type CabeceraProps = {
  /** Antetítulo: una línea corta de contexto sobre el titular. */
  subtitle?: string;
  title?: string;
  /** Párrafo de entrada entre el titular y el contenido. */
  description?: string;
};

/**
 * Antetítulo, titular y párrafo de entrada de una sección.
 *
 * Las tres piezas son opcionales por separado, y sumar sus condicionales
 * dentro de un bloque pasaba del límite de complejidad de `codigo.md`. Si no
 * hay ninguna, no pinta ni el contenedor.
 */
export function Cabecera({ subtitle, title, description }: CabeceraProps) {
  if (!subtitle && !title && !description) return null;

  return (
    <div className="mb-10 md:mb-16 lg:mb-20">
      {subtitle ? <Eyebrow className="mb-4">{subtitle}</Eyebrow> : null}
      {title ? <h2 className={cn('text-primary', description && 'mb-6')}>{title}</h2> : null}
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-xl font-medium">{description}</p>
      ) : null}
    </div>
  );
}
