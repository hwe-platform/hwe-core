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

/**
 * Si una variante de botón se pinta como enlace y no como caja.
 *
 * Por familia y no por igualdad: hay dos tratamientos de enlace —el de tarjeta
 * y el de sección, subrayado— y comparar contra `'link'` a secas dejaba al
 * segundo sin el color que le da la tarjeta. Lo que decide es si hay caja
 * debajo, que es lo que comparten.
 */
export function esVarianteDeEnlace(variant: string): boolean {
  return variant.startsWith('link');
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

/**
 * Color del titular de sección.
 *
 * Por mapa como todo lo demás: el diseño de referencia usa el color de texto
 * en tres secciones y el de marca en una, y añadir un tono es añadir una
 * entrada aquí.
 */
const TONOS: Record<string, string> = {
  default: 'text-foreground',
  brand: 'text-primary',
};

export type CabeceraProps = {
  /** Antetítulo: una línea corta de contexto sobre el titular. */
  subtitle?: string;
  title?: string;
  /** Párrafo de entrada entre el titular y el contenido. */
  description?: string;
  /** Color del titular. Por defecto, el color de texto. */
  tone?: string;
  /**
   * Nivel del titular. Gallery es el primer bloque que lo hace configurable
   * (HU-011); el resto sigue en `<h2>` porque nunca lo necesitó.
   *
   * Por defecto 2, y nunca 1 — el `<h1>` es del hero o del título de página,
   * y ningún bloque de sección debe poder competir con él.
   */
  level?: 2 | 3 | 4;
};

/** Etiqueta de titular por nivel. Tailwind no permite un tag dinámico sin tabla. */
const ETIQUETAS: Record<2 | 3 | 4, 'h2' | 'h3' | 'h4'> = { 2: 'h2', 3: 'h3', 4: 'h4' };

/**
 * Clase del titular: su color, más el margen que solo hace falta si debajo
 * viene un párrafo. Fuera del componente porque añadir `level` a `Cabecera`
 * la subió de 10 a 11 en la regla `complexity` de `codigo.md`, sin que esta
 * cuenta tenga ninguna decisión propia que justifique vivir ahí dentro.
 */
function claseTitular(tone: string, description: string | undefined): string {
  return cn(TONOS[tone] ?? TONOS.default, description && 'mb-6');
}

/**
 * Antetítulo, titular y párrafo de entrada de una sección.
 *
 * Las tres piezas son opcionales por separado, y sumar sus condicionales
 * dentro de un bloque pasaba del límite de complejidad de `codigo.md`. Si no
 * hay ninguna, no pinta ni el contenedor.
 */
export function Cabecera({
  subtitle,
  title,
  description,
  tone = 'default',
  level = 2,
}: CabeceraProps) {
  if (!subtitle && !title && !description) return null;

  const Titular = ETIQUETAS[level];

  return (
    <div className="mb-10 md:mb-16 lg:mb-20">
      {subtitle ? <Eyebrow className="mb-4">{subtitle}</Eyebrow> : null}
      {title ? <Titular className={claseTitular(tone, description)}>{title}</Titular> : null}
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-xl font-medium">{description}</p>
      ) : null}
    </div>
  );
}
