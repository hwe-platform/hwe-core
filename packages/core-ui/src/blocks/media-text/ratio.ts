/**
 * Proporción del marco del medio, por eje `ratio`.
 *
 * Los tres medios —imagen, embed y carrusel— comparten el mismo marco, así
 * que la tabla vive aquí una vez. Estaba copiada en los tres: la regla de
 * `codigo.md` es que a la tercera copia se extrae.
 */
export const PROPORCIONES: Record<string, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
};

/**
 * Columnas que ocupa el medio si el bloque no lo dice: mitad y mitad.
 *
 * Es el mismo valor que el `default` del schema. Vive aquí con nombre para
 * que el componente no repita el número suelto.
 */
export const DEFAULT_SPLIT = 6;

/** Cuántas columnas tiene la retícula. Doce, como la de Tailwind. */
export const COLUMNAS_RETICULA = 12;

/**
 * Clases de reparto de las doce columnas.
 *
 * Tailwind no puede generar clases a partir de una variable en tiempo de
 * ejecución —su compilador lee el código fuente—, así que las once posibles se
 * declaran aquí una vez. Sigue siendo un eje **numérico**: el dominio es 1–11,
 * y esto es solo cómo se materializa.
 */
const COLUMNAS: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
};

/**
 * Clase de reparto de un tramo, con respaldo al reparto por defecto.
 *
 * El respaldo no sobra aunque el schema acote el dominio a 1–11: los bloques
 * también se renderizan desde datos crudos en tests y overrides, y un número
 * fuera de tabla dejaría el tramo sin clase de columna —una fila rota en
 * lugar de una fila por defecto.
 */
export function columnasDe(split: number): string {
  return COLUMNAS[split] ?? COLUMNAS[DEFAULT_SPLIT];
}
