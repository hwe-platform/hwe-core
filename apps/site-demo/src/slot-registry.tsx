import { Insignia } from './blocks/media-text';

import type { SlotRegistry } from '@hwe-platform/core-ui';

/**
 * Qué se pinta en los huecos de cada instancia de bloque.
 *
 * Los slots son **código de este site**, no datos: no pueden viajar por
 * Payload. Lo que viaja es el `slotId` que el editor pone en el bloque, y aquí
 * se canjea por el contenido.
 *
 * Es la costura que permite que un adorno aparezca en **una** sección y no en
 * todas las del mismo tipo. Sin ella, la única forma de meter la insignia
 * sería envolver el bloque en el registry, y entonces saldría también en la
 * piscina, donde el diseño no la lleva.
 *
 * El bloque de plataforma sigue sin saber qué hay aquí: solo que tiene un
 * hueco encima de la imagen.
 */
export const slotRegistry: SlotRegistry = {
  // Sección de introducción de la home — App.tsx:536-541
  'intro-medallion': {
    sobreLaImagen: <Insignia etiqueta="Depuis" valor={30} sufijo="Ans" />,
  },
};
