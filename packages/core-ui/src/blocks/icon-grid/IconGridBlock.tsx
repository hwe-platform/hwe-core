import { iconGridBlockSchema } from './icon-grid.schema';
import { IconGridBare } from './IconGridBare';
import { IconGridCard } from './IconGridCard';
import { esAmplio, reticulaDe } from './grid';
import { BlockCtas, Cabecera, fondoDe } from '../seccion';
import { cn } from '../../lib/cn';
import { normalizePayloadData } from '../../payload/normalize-payload-data';

import type { ComponentType } from 'react';
import type { IconGridVariantProps, IconRegistry } from './icon-grid.types';

/**
 * Variante → componente.
 *
 * Va por mapa aunque las dos variantes sean de estilo: lo que cambia es el
 * envoltorio de cada item y la etiqueta HTML de su rótulo —`<h3>` suelto,
 * `<p>` dentro de tarjeta—, y resolverlo con un `if` dejaría un componente
 * haciendo dos cosas. La regla de `bloques.md` es el mapa, no el `switch`.
 */
const VARIANTES: Record<string, ComponentType<IconGridVariantProps>> = {
  bare: IconGridBare,
  card: IconGridCard,
};

/**
 * Separación entre items, derivada del ancho igual que todo lo demás.
 *
 * En el export la rejilla de tres respira mucho más que las de cinco y seis
 * —`gap-12 lg:gap-24` frente a `gap-8` y `gap-6`—, que es el mismo principio:
 * cuantos más entran en la fila, menos sitio tiene cada uno.
 */
const SEPARACION = {
  amplio: 'gap-12 lg:gap-24',
  estrecho: 'gap-6 md:gap-8',
};

export type IconGridProps = {
  /** Dato crudo del bloque, tal como llega de Payload. */
  data: unknown;
  /**
   * Iconos propios del site. El bloque de plataforma no conoce ninguno: los
   * recibe, igual que recibe los slots.
   */
  iconRegistry?: IconRegistry;
};

/**
 * Rejilla de iconos con etiqueta.
 *
 * Cubre cuatro secciones del diseño de referencia con dos ejes: cuántos caben
 * en la fila y si cada uno va suelto o en tarjeta. Todo lo demás —la rampa
 * responsive, el tamaño del marco, la escala tipográfica y la separación— se
 * **deriva** del número de columnas, para que el editor no pueda descuadrarlo.
 *
 * @example
 * <IconGridBlock data={bloque} iconRegistry={iconosDelCliente} />
 */
export function IconGridBlock({ data, iconRegistry }: IconGridProps) {
  // El BlockRenderer ya normaliza, pero el bloque se puede usar fuera de él y
  // un dato crudo de Payload —con sus `null`— dejaría la sección en blanco.
  const resultado = iconGridBlockSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('IconGrid: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const bloque = resultado.data;
  const Variante = VARIANTES[bloque.variant];
  const amplio = esAmplio(bloque.columns);

  if (!Variante) return null;

  return (
    <section className={cn('py-16 md:py-24 lg:py-32', fondoDe(bloque.background))}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Cabecera
          subtitle={bloque.subtitle}
          title={bloque.title}
          description={bloque.description}
        />

        <div
          className={cn(
            reticulaDe(bloque.columns),
            amplio ? SEPARACION.amplio : SEPARACION.estrecho,
          )}
        >
          <Variante items={bloque.items} amplio={amplio} iconRegistry={iconRegistry} />
        </div>

        <BlockCtas ctas={bloque.ctas} className="mt-12" />
      </div>
    </section>
  );
}
