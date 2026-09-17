/**
 * Colecciones que pueden responder a una URL, en el orden en que se consultan
 * (docs/arquitectura/paginas-routing.md).
 *
 * El orden importa: si dos documentos de colecciones distintas comparten slug,
 * gana el primero de esta lista. `pages` va delante porque su slug lo elige el
 * editor a conciencia.
 */
export const ROUTABLE_COLLECTIONS = ['pages', 'accommodations', 'entities', 'articles'] as const;

/** Colección capaz de responder a una URL. */
export type RoutableCollection = (typeof ROUTABLE_COLLECTIONS)[number];

/** Petición entrante ya troceada por Next. */
export type RouteRequest = {
  /** Segmentos de la URL. Vacío o ausente en la home. */
  slug?: string[];
};

/** Qué hay que buscar en Payload para responder a una URL. */
export type RouteQuery =
  { kind: 'home' } | { kind: 'document'; slug: string; collections: readonly RoutableCollection[] };

/**
 * Traduce los segmentos de una URL en la consulta que hay que hacer.
 *
 * Es pura para poder testearla sin Payload ni Next: el Server Component se
 * limita a ejecutar lo que devuelve. Mismo patrón que los hooks de HU-005.
 *
 * Los segmentos se reúnen con `/` porque las URLs son datos libres y pueden
 * tener la profundidad que el editor quiera (DEC-009): `/locations/mobil-home`
 * es un único slug, no una jerarquía.
 *
 * @example
 * resolveRoute({})                              // { kind: 'home' }
 * resolveRoute({ slug: ['le-camping'] })        // { kind: 'document', slug: 'le-camping', ... }
 * resolveRoute({ slug: ['a', 'b'] })            // slug: 'a/b'
 */
export function resolveRoute({ slug }: RouteRequest): RouteQuery {
  const segments = (slug ?? []).filter((segment) => segment.length > 0);

  if (segments.length === 0) return { kind: 'home' };

  return {
    kind: 'document',
    slug: segments.join('/'),
    collections: ROUTABLE_COLLECTIONS,
  };
}

/** Idioma soportado por el site y su prefijo en la URL. */
export type LocaleConfig = {
  /** Códigos disponibles, el primero es el principal. */
  locales: readonly string[];
  /** Si el idioma principal lleva prefijo en la URL. */
  prefixDefault: boolean;
};

/** Resultado de separar el idioma del resto de la ruta. */
export type LocalizedPath = {
  locale: string;
  /** Ruta sin el prefijo de idioma, siempre empezando por `/`. */
  pathname: string;
  /** Si la URL traía prefijo explícito. */
  hadPrefix: boolean;
};

/**
 * Separa el prefijo de idioma del resto de la ruta.
 *
 * Con `prefixDefault: false`, `/le-camping` es francés y `/en/the-campsite`
 * inglés. Con `true`, el principal también lleva prefijo. La estrategia por
 * dominio (DEC-009) se resuelve en otro sitio: aquí solo se trata el prefijo,
 * que es lo único que implementa el Hito 1.
 *
 * @example
 * splitLocale('/en/the-campsite', { locales: ['fr','en'], prefixDefault: false })
 * // { locale: 'en', pathname: '/the-campsite', hadPrefix: true }
 */
export function splitLocale(pathname: string, config: LocaleConfig): LocalizedPath {
  const [defaultLocale] = config.locales;
  const segments = pathname.split('/').filter((segment) => segment.length > 0);
  const [first, ...rest] = segments;

  if (first && config.locales.includes(first)) {
    return { locale: first, pathname: `/${rest.join('/')}`, hadPrefix: true };
  }

  return {
    locale: defaultLocale ?? '',
    pathname: `/${segments.join('/')}`,
    hadPrefix: false,
  };
}

/**
 * Decide si una URL sin prefijo debe redirigirse a la versión con prefijo.
 *
 * Solo aplica cuando el cliente ha pedido que el idioma principal también lo
 * lleve (`prefixDefault`). Devuelve `undefined` si no hay que redirigir.
 */
export function localeRedirect(pathname: string, config: LocaleConfig): string | undefined {
  if (!config.prefixDefault) return undefined;

  const { hadPrefix, locale } = splitLocale(pathname, config);
  if (hadPrefix || !locale) return undefined;

  return `/${locale}${pathname === '/' ? '' : pathname}`;
}
