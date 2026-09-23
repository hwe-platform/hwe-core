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

/**
 * Retícula destino de las rejillas amplias, que llegan a su sitio antes.
 *
 * En el export una rejilla de tres ya está repartida en `md` —`grid-cols-1
 * md:grid-cols-3`— mientras que las de cinco y seis pasan por una parada
 * intermedia y no llegan hasta `lg`. Es el mismo umbral que gobierna el resto:
 * cuantos menos entran en la fila, antes caben.
 */
const COLUMNAS_AMPLIAS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
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
 * La rampa sale del export: la de tres arranca en una columna y llega a su
 * sitio en `md`; las de cinco y seis arrancan en dos, paran en tres y no
 * llegan hasta `lg`. Un solo umbral decide las dos cosas —dónde arranca y
 * dónde acaba— porque son la misma pregunta: cuántos caben en la fila.
 */
export function reticulaDe(columns: number): string {
  const amplio = esAmplio(columns);

  if (amplio) {
    const destino = COLUMNAS_AMPLIAS[columns] ?? COLUMNAS_AMPLIAS[COLUMNAS_POR_DEFECTO];
    return ['grid', 'grid-cols-1', destino].join(' ');
  }

  const destino = COLUMNAS[columns] ?? COLUMNAS[COLUMNAS_POR_DEFECTO];
  return ['grid', 'grid-cols-2', 'md:grid-cols-3', destino].join(' ');
}
