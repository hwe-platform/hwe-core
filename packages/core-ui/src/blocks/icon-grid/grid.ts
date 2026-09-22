/**
 * Clases de retícula por número de columnas.
 *
 * Tailwind no genera clases desde una variable en tiempo de ejecución —su
 * compilador lee el código fuente—, así que las doce posibles se declaran
 * aquí. Sigue siendo un eje **numérico**: el dominio es 1–12 y esto es solo
 * cómo se materializa.
 */
const COLUMNAS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

/** Columnas por defecto si el número está fuera de tabla. */
export const COLUMNAS_POR_DEFECTO = 3;

/**
 * Un bloque es **amplio** cuando caben tres o menos en la fila.
 *
 * Un único umbral gobierna todo lo que cambia con el número de columnas: por
 * dónde arranca la rampa responsive, el tamaño del marco circular y la escala
 * tipográfica. En el diseño de referencia la rejilla de tres lleva marco de
 * 96px y titular de 24px, y las de cinco y seis bajan a 80px y 18px — no son
 * tres decisiones, es que cuantos más entran en la fila, menos sitio tiene
 * cada uno.
 *
 * Por eso no es un eje: se deriva, y el editor no puede descuadrarlo.
 */
export function esAmplio(columns: number): boolean {
  return columns <= 3;
}

/**
 * Clases de retícula de una rejilla de N columnas, con su rampa responsive.
 *
 * La rampa sale del export: la de tres arranca en una columna y las de cinco y
 * seis arrancan en dos, con una parada intermedia en tres. El tope de la
 * parada intermedia es el propio número, para que una rejilla de dos no pase
 * por tres columnas antes de llegar a su sitio.
 */
export function reticulaDe(columns: number): string {
  const destino = COLUMNAS[columns] ?? COLUMNAS[COLUMNAS_POR_DEFECTO];
  const base = esAmplio(columns) ? 'grid-cols-1' : 'grid-cols-2';
  const intermedia = columns <= 3 ? '' : 'md:grid-cols-3';

  return ['grid', base, intermedia, destino].filter(Boolean).join(' ');
}
