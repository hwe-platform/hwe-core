/**
 * Concatena clases de Tailwind, descartando valores falsy.
 *
 * @param classes - Clases o expresiones condicionales (`undefined`/`false` se ignoran)
 * @returns Las clases unidas por un espacio
 *
 * @example
 * cn('flex', isActive && 'bg-primary', undefined)
 * // 'flex bg-primary'
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
