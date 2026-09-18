/**
 * Campo de un config de Payload, reducido a lo que necesita el test de
 * paridad: o tiene nombre, o es un contenedor de presentación (`row`,
 * `collapsible`, `tabs`) que agrupa otros campos sin añadir una clave al
 * documento.
 */
export type ParityField = {
  name?: string;
  fields?: ParityField[];
  tabs?: ParityField[];
  type?: string;
  /** Opciones de un campo `select`. Payload admite cadenas o `{label, value}`. */
  options?: (string | { value: string })[];
};

/**
 * Nombres de campo que un config de Payload aporta al documento, aplanando
 * los contenedores de presentación. Un `group` sí cuenta —añade su clave—,
 * una `row` no.
 */
export function topLevelFieldNames(fields: ParityField[]): string[] {
  return fields.flatMap((field) => {
    if (field.name) return [field.name];
    if (field.tabs) return topLevelFieldNames(field.tabs);
    if (field.fields) return topLevelFieldNames(field.fields);
    return [];
  });
}

/** Resultado de comparar un config de Payload con su schema Zod. */
export type ParityResult = {
  /** Claves del schema que ningún campo del config cubre. */
  missingInConfig: string[];
  /** Campos del config que el schema no declara. */
  missingInSchema: string[];
};

/** Datos que necesita {@link compareFieldParity}. */
export type ParityInput = {
  /** Claves del schema Zod de lectura (`Object.keys(schema.shape)`). */
  schemaKeys: string[];
  /** Campos declarados en el config de Payload. */
  fields: ParityField[];
  /**
   * Claves que Payload rellena solo y por tanto no se declaran como campo:
   * `id`, y en una colección de uploads también `filename`, `mimeType`, etc.
   */
  autoFields?: string[];
};

/**
 * Compara un config de Payload con su schema Zod y devuelve las diferencias
 * en los dos sentidos.
 *
 * Es el mecanismo que mantiene honesto DEC-004: los configs se escriben a
 * mano porque los schemas no llevan la metainformación de Payload
 * (`localized`, `required`, labels), pero si alguien añade un campo en un
 * sitio y no en el otro, el test lo caza.
 *
 * Solo compara el primer nivel — la paridad campo a campo dentro de grupos
 * y arrays la cubre el schema Zod al validar en el `beforeChange`.
 *
 * @example
 * compareFieldParity({ schemaKeys: ['id', 'name'], fields: [{ name: 'name' }], autoFields: ['id'] })
 * // { missingInConfig: [], missingInSchema: [] }
 */
export function compareFieldParity({
  schemaKeys,
  fields,
  autoFields = [],
}: ParityInput): ParityResult {
  const configNames = new Set(topLevelFieldNames(fields));
  const auto = new Set(autoFields);

  return {
    missingInConfig: schemaKeys.filter((key) => !configNames.has(key) && !auto.has(key)),
    missingInSchema: [...configNames].filter(
      (name) => !schemaKeys.includes(name) && !auto.has(name),
    ),
  };
}

/**
 * Una divergencia entre las opciones de un `select` y su enum en el schema.
 */
export type OptionMismatch = {
  /** Ruta del campo dentro del global o colección, p. ej. `topBar.links.icon`. */
  path: string;
  /** Valores que el schema acepta y el editor no puede elegir. */
  missingInConfig: string[];
  /** Valores que el editor puede elegir y el schema rechaza. */
  missingInSchema: string[];
};

/** Lo que un nodo de Zod expone, visto desde fuera y sin tocar internos. */
type NodoZod = {
  shape?: Record<string, unknown>;
  element?: unknown;
  options?: unknown[];
  unwrap?: () => unknown;
  def?: { innerType?: unknown };
};

/**
 * Quita los envoltorios de un nodo Zod —`optional`, `nullable`, `default`—
 * hasta llegar al tipo que de verdad describe el dato.
 */
function desenvolver(nodo: unknown): NodoZod {
  let actual = nodo as NodoZod;
  for (let i = 0; i < 10 && actual; i++) {
    if (typeof actual.unwrap === 'function') {
      actual = actual.unwrap() as NodoZod;
      continue;
    }
    if (actual.def?.innerType) {
      actual = actual.def.innerType as NodoZod;
      continue;
    }
    return actual;
  }
  return actual;
}

/** El nodo Zod que corresponde a un campo hijo, o `undefined` si no hay. */
function hijo(nodo: unknown, nombre: string): unknown {
  const n = desenvolver(nodo);
  if (n?.shape) return n.shape[nombre];
  // Un `array` de Payload guarda una lista de objetos: se baja un nivel más.
  if (n?.element) return desenvolver(n.element)?.shape?.[nombre];
  return undefined;
}

/** Los valores de un `select` de Payload, vengan como cadena o como objeto. */
function valoresDe(options: ParityField['options']): string[] {
  return (options ?? []).map((o) => (typeof o === 'string' ? o : o.value));
}

/**
 * Compara un campo con su nodo del schema, si es un `select` con enum enfrente.
 *
 * @returns la divergencia, o `null` si no la hay o si el campo no es comparable
 */
function compararSelect(campo: ParityField, nodo: unknown, ruta: string[]): OptionMismatch | null {
  if (campo.type !== 'select' || !nodo) return null;

  const delSchema = desenvolver(nodo).options;
  if (!Array.isArray(delSchema)) return null;

  const enSchema = delSchema.map(String);
  const enConfig = valoresDe(campo.options);
  const missingInConfig = enSchema.filter((v) => !enConfig.includes(v));
  const missingInSchema = enConfig.filter((v) => !enSchema.includes(v));

  if (missingInConfig.length === 0 && missingInSchema.length === 0) return null;
  return { path: ruta.join('.'), missingInConfig, missingInSchema };
}

/**
 * Compara las **opciones** de cada `select` de un config de Payload con el
 * `z.enum` que le corresponde en el schema, a cualquier profundidad.
 *
 * `compareFieldParity` solo mira el primer nivel de nombres, así que dos listas
 * de valores podían divergir sin que nada fallara: el editor veía unas opciones
 * y el schema aceptaba otras. El síntoma llegaba tarde y lejos —una escritura
 * rechazada con HTTP 400 en un `select` que el panel ofrecía— y por eso conviene
 * que lo diga un test.
 *
 * Fuera del alcance a propósito: los `select` sin enum en el schema no se
 * reportan. Hay campos cuyos valores no son un conjunto cerrado.
 *
 * @example
 * compareOptionParity({ schema: headerSchema, fields: Header.fields })
 * // [] si todas las listas coinciden
 */
export function compareOptionParity({
  schema,
  fields,
}: {
  schema: unknown;
  fields: ParityField[];
}): OptionMismatch[] {
  const fallos: OptionMismatch[] = [];

  function recorrer(campos: ParityField[], nodo: unknown, ruta: string[]) {
    for (const campo of campos) {
      // Los contenedores de presentación no aportan clave ni nivel.
      if (!campo.name) {
        const dentro = campo.tabs ?? campo.fields;
        if (dentro) recorrer(dentro, nodo, ruta);
        continue;
      }

      const suyo = hijo(nodo, campo.name);
      const suRuta = [...ruta, campo.name];

      const fallo = compararSelect(campo, suyo, suRuta);
      if (fallo) fallos.push(fallo);

      if (campo.fields) recorrer(campo.fields, suyo, suRuta);
    }
  }

  recorrer(fields, schema, []);
  return fallos;
}
