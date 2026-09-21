/**
 * Limpia un documento de Payload antes de validarlo con Zod.
 *
 * Payload representa "vacío" con `null` y Zod con `undefined`, y `.optional()`
 * acepta el segundo pero no el primero. Además, un `group` sin rellenar llega
 * como `{}` en vez de ausente, así que sus campos obligatorios fallan aunque el
 * grupo entero sea opcional.
 *
 * **Hace falta en las dos direcciones.** Se escribió pensando solo en la
 * escritura, con el supuesto de que una lectura venía limpia. No es cierto: un
 * media poblado llega con `caption: null` y con los tamaños que Payload no
 * generó en `{ url: null, width: null }`. Con ese supuesto, los bloques que
 * referencian imágenes no validaban y la página salía en blanco.
 *
 * Son peculiaridades del transporte, no del modelo: el schema describe el
 * documento, y esto traduce lo que viaja a esa forma. No toca los arrays
 * vacíos — `[]` sí es un valor con significado.
 *
 * @example
 * normalizePayloadData({ a: null, b: {}, c: { d: 1 }, e: [] })
 * // { c: { d: 1 }, e: [] }
 */
export function normalizePayloadData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizePayloadData(item)) as T;
  }

  if (data === null || typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  const limpio: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(data)) {
    if (valor === null || valor === undefined) continue;

    const normalizado = normalizePayloadData(valor);
    if (esObjetoVacio(normalizado)) continue;

    limpio[clave] = normalizado;
  }

  return limpio as T;
}

/** Un objeto plano sin claves. Los arrays vacíos no cuentan: `[]` es un valor. */
function esObjetoVacio(valor: unknown): boolean {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    !Array.isArray(valor) &&
    !(valor instanceof Date) &&
    Object.keys(valor).length === 0
  );
}
