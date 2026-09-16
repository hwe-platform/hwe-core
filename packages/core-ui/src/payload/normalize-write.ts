/**
 * Limpia el payload de escritura de Payload antes de validarlo con Zod.
 *
 * El admin no manda lo mismo que devuelve una lectura, y dos diferencias
 * rompen la validación si no se tratan:
 *
 * - Un campo opcional vacío llega como `null`, y `.optional()` de Zod acepta
 *   `undefined`, no `null`.
 * - Un `group` sin rellenar llega como `{}` en lugar de ausente, así que sus
 *   campos obligatorios fallan aunque el grupo entero sea opcional.
 *
 * Son peculiaridades del transporte, no del modelo de dominio: el schema
 * describe el documento que se lee, y esta función traduce la escritura a esa
 * forma. No toca los arrays vacíos — `[]` sí es un valor con significado.
 *
 * @example
 * normalizeWriteData({ a: null, b: {}, c: { d: 1 }, e: [] })
 * // { c: { d: 1 }, e: [] }
 */
export function normalizeWriteData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeWriteData(item)) as T;
  }

  if (data === null || typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  const limpio: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(data)) {
    if (valor === null || valor === undefined) continue;

    const normalizado = normalizeWriteData(valor);
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
