import type { LocaleConfig } from '@hwe-platform/core-ui';
import type { Config } from './payload-types';

/**
 * Idioma válido para una consulta a Payload.
 *
 * Sale de los tipos que genera Payload, así que si alguien añade un idioma en
 * `payload.config.ts` y se olvida de `LOCALES`, el compilador lo caza.
 */
export type SiteLocale = Config['locale'];

/**
 * Idiomas del site, en el mismo orden que `payload.config.ts`: el primero es
 * el principal.
 *
 * Duplicado a propósito y no leído de `site-config`: el middleware corre en el
 * edge y no puede abrir una conexión a Payload. Si algún día divergen, lo que
 * manda para el contenido es `payload.config.ts` — aquí solo se decide qué
 * prefijo de URL se reconoce.
 */
export const LOCALES = ['fr', 'en', 'es'] as const satisfies readonly SiteLocale[];

/** Idioma principal. Es el fallback de Payload cuando falta una traducción. */
export const DEFAULT_LOCALE: SiteLocale = LOCALES[0];

/**
 * Comprueba que un valor suelto es un idioma del site.
 *
 * Hace falta porque el idioma llega en una cabecera HTTP, que es texto libre:
 * nada impide que alguien pida `/xx/loquesea` o manipule la cabecera.
 */
export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return LOCALES.some((locale) => locale === value);
}

/**
 * Si el idioma principal lleva prefijo en la URL.
 *
 * `false` significa que `/le-camping` es francés y `/en/the-campsite` inglés.
 * Cada cliente lo decide según su estrategia SEO (DEC-009); aquí se refleja lo
 * que tenga `site-config.languages.prefixDefault`.
 */
export const PREFIX_DEFAULT_LOCALE = false;

/** Configuración que consumen los helpers de ruta de core-ui. */
export const localeConfig: LocaleConfig = {
  locales: LOCALES,
  prefixDefault: PREFIX_DEFAULT_LOCALE,
};

/**
 * Cabecera con la que el middleware pasa el idioma a los Server Components.
 *
 * Se usa una cabecera y no un parámetro de ruta para que el prefijo de idioma
 * no ensucie el `slug` que recibe el catch-all: la página ve siempre la URL sin
 * idioma, y el idioma por separado.
 */
export const LOCALE_HEADER = 'x-hwe-locale';
