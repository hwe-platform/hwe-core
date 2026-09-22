import { IconGridBlock as Base } from '@hwe-platform/core-ui';

import { iconRegistry } from '../../icons';

import type { BlockComponentProps } from '@hwe-platform/core-ui';

/**
 * Rejilla de iconos de este site.
 *
 * Es un override de **nivel 2**: el bloque de plataforma entero, con sus
 * iconos propios enchufados. A diferencia de los slots, que van por instancia
 * porque el adorno aparece en una sección y no en otra, el juego de iconos es
 * del site entero — todas las rejillas de La Civelle pueden usar los tres.
 *
 * Por eso aquí sí vale envolver el bloque: lo que se inyecta no cambia entre
 * instancias.
 */
export function IconGridBlock({ data }: BlockComponentProps) {
  return <Base data={data} iconRegistry={iconRegistry} />;
}
