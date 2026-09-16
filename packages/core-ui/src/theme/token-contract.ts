/**
 * Contrato de CSS variables que todo `theme.css` de cliente debe definir.
 *
 * Cada clave es el nombre de la CSS variable de la Capa 1 (tema base) descrita
 * en `docs/arquitectura/tokens.md`. El valor es el fallback que se usa si el
 * theme del cliente no la define (los valores por defecto son los de La Civelle,
 * el primer cliente de referencia).
 *
 * @example
 * const primaryFallback = TOKEN_CONTRACT['--primary']
 * // '#0b665d'
 */
export const TOKEN_CONTRACT = {
  '--primary': '#0b665d',
  '--primary-foreground': '#fcfcf1',
  '--secondary': '#c9a87c',
  '--secondary-foreground': '#2e3c2e',
  '--background': '#fffeed',
  '--foreground': '#2e3c2e',
  '--card': '#ffffff',
  '--card-foreground': '#2e3c2e',
  '--muted': '#ecefee',
  '--muted-foreground': '#525252',
  '--accent': '#85a39c',
  '--accent-foreground': '#0b665d',
  '--border': '#ede5d8',
  '--destructive': '#d4183d',
  '--destructive-foreground': '#ffffff',
  '--ring': '#0b665d',
  '--footer': '#393939',
  '--heading-font': '"Bitter", serif',
  '--body-font': '"Inter", sans-serif',
  '--font-weight-normal': '400',
  '--font-weight-medium': '500',
  '--font-weight-bold': '700',
  '--radius': '1rem',
} as const satisfies Record<string, string>;

/** Nombre de una CSS variable del contrato de tokens (ej: `'--primary'`). */
export type TokenName = keyof typeof TOKEN_CONTRACT;
