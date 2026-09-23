import type { z } from 'zod';
import type { cardGridBlockSchema } from './card-grid.schema';

/** Datos del bloque, derivados del schema Zod (DEC-004). */
export type CardGridData = z.infer<typeof cardGridBlockSchema>;

/** Una tarjeta de la rejilla. */
export type CardGridItem = CardGridData['items'][number];

/** Props que comparten las dos anatomías de tarjeta. */
export type CardProps = {
  item: CardGridItem;
  /** Clase de columna, cuando el reparto es asimétrico. */
  className?: string;
  /** Escala de la tarjeta. Solo la usa la variante con texto sobre la imagen. */
  size?: string;
};
