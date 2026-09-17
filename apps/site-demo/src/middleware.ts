import { NextResponse } from 'next/server';
import { splitLocale, localeRedirect } from '@hwe-platform/core-ui';

import { localeConfig, LOCALE_HEADER } from './i18n';

import type { NextRequest } from 'next/server';

/**
 * Detecta el idioma desde el prefijo de la URL y se lo pasa a la página.
 *
 * Reescribe la petición quitando el prefijo, de forma que el catch-all recibe
 * siempre la ruta sin idioma y el idioma llega aparte en una cabecera. Así
 * `/en/the-campsite` y `/le-camping` entran por el mismo sitio.
 *
 * Es propio y no `next-intl` a propósito: para tres idiomas con estrategia de
 * prefijo esto es todo lo que hace falta, y aún no hay textos de interfaz que
 * traducir que justifiquen la dependencia (docs/estandares/codigo.md).
 *
 * La estrategia por dominio de DEC-009 no se implementa en el Hito 1.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const destino = localeRedirect(pathname, localeConfig);
  if (destino) {
    return NextResponse.redirect(new URL(destino, request.url));
  }

  const { locale, pathname: sinIdioma } = splitLocale(pathname, localeConfig);

  const cabeceras = new Headers(request.headers);
  cabeceras.set(LOCALE_HEADER, locale);

  const url = request.nextUrl.clone();
  url.pathname = sinIdioma;

  return NextResponse.rewrite(url, { request: { headers: cabeceras } });
}

export const config = {
  /**
   * Todo menos lo que no es una página: el admin y la API de Payload, los
   * assets de Next y los archivos con extensión.
   */
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
