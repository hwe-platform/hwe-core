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
