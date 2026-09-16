import { ICON_NAMES } from '@hwe-platform/core-ui';

import type { Field } from 'payload';

/**
 * Opciones de un `select` de icono. Salen del set de la primitiva `Icon` de
 * core-ui, así que el editor no puede elegir un icono que el frontend no sepa
 * pintar — si se añade uno al set, aparece aquí solo.
 */
export const iconOptions = ICON_NAMES.map((name) => ({ label: name, value: name }));

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
