import { iconField } from '../icons';

import type { Field } from 'payload';

/**
 * Piezas que comparten varios bloques del catálogo.
 *
 * Salen del fichero que tenía las definiciones porque las usa casi cualquier
 * bloque, y porque ese fichero se pasó del límite de líneas de `codigo.md` en
 * cuanto el catálogo creció. Cada bloque vive ahora en su propio módulo.
 */

/** Cabecera opcional que comparten los bloques con título y subtítulo. */
export const headingFields: Field[] = [
  { name: 'title', type: 'text', localized: true },
  { name: 'subtitle', type: 'text', localized: true },
];

/**
 * Iconos que un enlace puede llevar a la derecha del texto.
 *
 * Lista corta a propósito, como la de la barra de servicio: un `select` con
 * el set entero invita a elegir mal. Debe coincidir con el set de la primitiva
 * `Icon`; el test de paridad no lo comprueba porque el schema lo declara como
 * texto libre, así que el componente ignora lo que no conoce.
 */
const ICONOS_DE_ENLACE = ['arrowRight', 'chevronRight', 'calendar', 'phone', 'mail'];

/** Enlace con texto, destino y estilo, igual que `blockLinkSchema` en core-ui. */
export const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true, localized: true },
  { name: 'url', type: 'text', required: true },
  {
    name: 'variant',
    type: 'select',
    defaultValue: 'primary',
    options: ['primary', 'secondary', 'outline', 'ghost', 'link'],
  },
  {
    name: 'icon',
    type: 'select',
    options: ICONOS_DE_ENLACE,
    admin: { description: 'Icono a la derecha del texto. Opcional.' },
  },
];

export { iconField };
