import type { z } from 'zod';
import type { ComponentType } from 'react';
import type { iconGridBlockSchema } from './icon-grid.schema';

/** Datos del bloque, derivados del schema Zod (DEC-004). */
export type IconGridData = z.infer<typeof iconGridBlockSchema>;

/** Un item de la rejilla. */
export type IconGridItem = IconGridData['items'][number];

/**
 * Iconos propios del cliente, por nombre.
 *
 * Los SVG de un cliente no pueden viajar por Payload —lo que se guarda es un
 * string— y tampoco pueden vivir en `core-ui`, que es plataforma. El site los
 * declara en su repo y se los pasa al bloque, igual que hace con los slots.
 *
 * El componente que se registre aquí recibe `className`, así que debe pintar
 * su trazo con `currentColor` para que herede el color del token.
 */
export type IconRegistry = Record<string, ComponentType<{ className?: string }>>;

/** Props que comparten las dos variantes de la rejilla. */
export type IconGridVariantProps = {
  items: IconGridItem[];
  /** Si cabe poco en la fila, todo encoge. Sale de `esAmplio`. */
  amplio: boolean;
  iconRegistry?: IconRegistry;
};
