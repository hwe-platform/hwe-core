import { AnimationsEteIcon } from './AnimationsEte';
import { EauChauffeeIcon } from './EauChauffee';
import { EspritFamilialIcon } from './EspritFamilial';

import type { IconRegistry } from '@hwe-platform/core-ui';

/**
 * Iconos propios de La Civelle, por nombre.
 *
 * El diseño trae tres SVG que no existen en `lucide-react`, y no pueden vivir
 * en `core-ui`: son de este cliente y de nadie más. Tampoco pueden viajar por
 * Payload, que solo guarda texto. Lo que viaja es el nombre, y este registro
 * es lo que lo convierte en un componente — el mismo patrón que los slots.
 *
 * Las claves son las que ve el editor en el `select` de icono, así que se
 * mantienen a la par con `NOMBRES_DE_ICONO_PROPIOS` en `fields/icons.ts`.
 */
export const iconRegistry: IconRegistry = {
  eauChauffee: EauChauffeeIcon,
  espritFamilial: EspritFamilialIcon,
  animationsEte: AnimationsEteIcon,
};

/** Los nombres del registro, para que el campo de Payload los ofrezca. */
export const NOMBRES_DE_ICONO_PROPIOS = Object.keys(iconRegistry);
