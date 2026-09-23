import { ICON_NAMES } from '@hwe-platform/core-ui';

import { NOMBRES_DE_ICONO_PROPIOS } from '../icons';

import type { Field } from 'payload';

/**
 * Opciones de un `select` de icono.
 *
 * Son los del set de la primitiva `Icon` de core-ui más los propios de este
 * cliente, así que el editor no puede elegir uno que el frontend no sepa
 * pintar — si se añade a cualquiera de los dos sitios, aparece aquí solo.
 *
 * Este fichero vive en el repo del site y no en plataforma, que es justo lo
 * que permite ampliarlo sin tocar `core-ui`.
 */
export const iconOptions = [...ICON_NAMES, ...NOMBRES_DE_ICONO_PROPIOS].map((name) => ({
  label: name,
  value: name,
}));

/** Opciones de {@link iconField}. */
export type IconFieldOptions = {
  /** Nombre del campo. Por defecto `icon`. */
  name?: string;
  /** Si el editor está obligado a elegir uno. */
  required?: boolean;
};

/**
 * Campo de icono listo para usar dentro de un array de equipamiento o features.
 *
 * Recibe `required` como opción en lugar de dejar que el llamante haga spread
 * sobre el resultado: el tipo `Field` de Payload es una unión discriminada y un
 * spread la rompe.
 */
export function iconField({ name = 'icon', required = false }: IconFieldOptions = {}): Field {
  return { name, type: 'select', options: iconOptions, required };
}
