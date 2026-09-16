/**
 * Caracteres que `String.normalize('NFD')` no descompone en letra + acento,
 * así que hay que mapearlos a mano. Son los que aparecen en los idiomas
 * del proyecto (ver specs/payload/localizacion.md).
 */
const NON_DECOMPOSABLE: Record<string, string> = {
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ø: 'o',
  đ: 'd',
  ł: 'l',
};

/** Marcas diacríticas que deja `NFD` tras descomponer una letra acentuada. */
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Convierte un texto en un slug apto para URL: minúsculas, sin acentos y con
 * guiones en lugar de espacios.
 *
 * Solo genera un segmento — no trata la `/` como separador de ruta, la
 * elimina como cualquier otro carácter no alfanumérico. Las rutas de varios
 * segmentos las compone el editor a mano (ver docs/arquitectura/paginas-routing.md).
 *
 * @example
 * slugify('Mobile Home Confort 3 chambres') // 'mobile-home-confort-3-chambres'
 * slugify('Épicerie & Bar')                 // 'epicerie-bar'
 */
export function slugify(value: string): string {
  const mapped = [...value.toLowerCase()].map((char) => NON_DECOMPOSABLE[char] ?? char).join('');

  return mapped
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Datos que necesita {@link resolveSlug} para decidir el slug de un documento. */
export type ResolveSlugInput = {
  /** Slug que ya tiene el documento, si el editor lo escribió a mano. */
  current?: string | null;
  /** Campo del que derivarlo cuando no hay slug manual (`title` o `name`). */
  source?: string | null;
};

/**
 * Decide el slug que debe guardarse: respeta el que el editor haya escrito y,
 * si está vacío, lo deriva del título. Devuelve `undefined` cuando no hay ni
 * slug ni título, para que el hook deje el campo como estaba.
 *
 * Un slug manual también se normaliza — si el editor escribe "Le Camping",
 * se guarda "le-camping".
 *
 * @example
 * resolveSlug({ source: 'Le Camping' })                  // 'le-camping'
 * resolveSlug({ current: 'custom', source: 'Le Camping' }) // 'custom'
 */
export function resolveSlug({ current, source }: ResolveSlugInput): string | undefined {
  const fromCurrent = current ? slugify(current) : '';
  if (fromCurrent) return fromCurrent;

  const fromSource = source ? slugify(source) : '';
  return fromSource || undefined;
}
