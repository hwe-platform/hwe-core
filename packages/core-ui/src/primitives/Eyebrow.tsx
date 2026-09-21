import { cva } from 'class-variance-authority';

import { cn } from '../lib/cn';

import type { VariantProps } from 'class-variance-authority';
import type { ElementType, ReactNode } from 'react';

/**
 * Etiqueta corta en mayúsculas sobre el color de acento.
 *
 * Es el átomo más reutilizado del diseño: aparece como supertítulo del hero,
 * como antetítulo de cada sección y como título de columna del pie. Se
 * distingue de un encabezado en que **no estructura el documento**: acompaña
 * al `<h2>` que viene debajo, no lo sustituye. Por eso su etiqueta HTML por
 * defecto es `<p>` y no un heading.
 *
 * Los tamaños salen de los usos reales: `sm` para títulos de columna, `md`
 * para antetítulos de sección, `lg` para el supertítulo del hero, que es el
 * más espaciado.
 */
const eyebrowVariants = cva('font-body font-bold uppercase', {
  variants: {
    size: {
      sm: 'text-[10px] tracking-[1.1px]',
      md: 'text-sm tracking-[3.6px]',
      lg: 'text-sm tracking-[4.6px]',
    },
    variant: {
      plain: 'text-secondary',
      badge: 'bg-secondary/10 text-secondary inline-block rounded-full px-4 py-2 tracking-[2px]',
    },
  },
  defaultVariants: { size: 'md', variant: 'plain' },
});

/** Props de {@link Eyebrow}. */
export type EyebrowProps = VariantProps<typeof eyebrowVariants> & {
  children: ReactNode;
  className?: string;
  /**
   * Línea corta de acento a la izquierda, como en la intro de La Civelle
   * (`App.tsx:548`). Es aditiva —nada cambia si no se pide— y vive aquí y no
   * en el bloque porque la etiqueta es la primitiva y la línea la acompaña.
   */
  rule?: boolean;
  /**
   * Etiqueta HTML. Se cambia solo cuando la etiqueta encabeza una región con
   * significado propio — por ejemplo `h2` en una columna del pie.
   */
  as?: ElementType;
};

/**
 * @example
 * <Eyebrow>Notre esprit</Eyebrow>
 * <Eyebrow size="sm" as="h2">Plan du site</Eyebrow>
 * <Eyebrow variant="badge">Camping</Eyebrow>
 */
export function Eyebrow({
  children,
  className,
  size,
  variant,
  rule = false,
  as: Tag = 'p',
}: EyebrowProps) {
  const clases = cn(eyebrowVariants({ size, variant }), className);

  if (!rule) return <Tag className={clases}>{children}</Tag>;

  // La línea va fuera de la etiqueta y decorativa: no es texto ni lo separa.
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className="bg-secondary h-px w-12 shrink-0" />
      <Tag className={clases}>{children}</Tag>
    </div>
  );
}
