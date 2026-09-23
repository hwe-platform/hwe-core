/**
 * Proporción del marco de cada imagen, por `aspectRatio`.
 *
 * El dominio de Gallery —`16/9 | 4/3 | 3/2 | 1/1 | auto`— no es el de la
 * primitiva `Image` (`16/9 | 4/3 | 1/1 | 3/4`, fijado en HU-006 para otros
 * bloques), así que la tabla vive aquí y no se toca la primitiva: es lo mismo
 * que hizo `media-text` con su propio `PROPORCIONES`.
 *
 * `auto` no lleva clase: es el único valor con sentido en `masonry`, donde la
 * altura variable de cada foto es el punto de la variante, y forzar un
 * contenedor de proporción fija lo anularía.
 */
export const PROPORCIONES: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  auto: '',
};

/** Proporción por defecto si el valor no está en tabla. */
export const PROPORCION_POR_DEFECTO = '16/9';

/** Clase de proporción de un marco, con respaldo a la proporción por defecto. */
export function proporcionDe(aspectRatio: string): string {
  return PROPORCIONES[aspectRatio] ?? PROPORCIONES[PROPORCION_POR_DEFECTO];
}

/**
 * Retícula de `grid`, por número de columnas.
 *
 * El dominio de Gallery son 2, 3 o 4 columnas — no las 1–12 de `icon-grid` o
 * `card-grid`: una galería de una columna no es una rejilla, y por encima de
 * cuatro las fotos se quedan sin sitio para respirar. En móvil siempre
 * colapsa a una o dos, que es lo que pide la guía del bloque antiguo.
 */
const COLUMNAS_GRID: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

/** Columnas por defecto si el número está fuera de tabla. */
export const COLUMNAS_POR_DEFECTO = 3;

/** Clases de retícula de `grid`, con su rampa responsive. */
export function reticulaDe(columns: number): string {
  return `grid ${COLUMNAS_GRID[columns] ?? COLUMNAS_GRID[COLUMNAS_POR_DEFECTO]}`;
}

/**
 * Columnas CSS de `masonry`, por número de columnas.
 *
 * `columns-*` de Tailwind reparte los hijos en flujo de columna —cada foto
 * cae en la que le toca según su alto real— que es justo lo que separa a
 * `masonry` de `grid`: aquí no hay celdas, hay un flujo.
 */
const COLUMNAS_MASONRY: Record<number, string> = {
  2: 'columns-1 sm:columns-2',
  3: 'columns-1 sm:columns-2 md:columns-3',
  4: 'columns-2 md:columns-4',
};

/** Clases de columnas de `masonry`, con su rampa responsive. */
export function columnasDe(columns: number): string {
  return COLUMNAS_MASONRY[columns] ?? COLUMNAS_MASONRY[COLUMNAS_POR_DEFECTO];
}
