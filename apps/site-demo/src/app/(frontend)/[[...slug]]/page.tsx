import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { BlockRenderer, mediaUrl, resolveRoute } from '@hwe-platform/core-ui';

import config from '../../../payload.config';
import { blockRegistry } from '../../../block-registry';
import { slotRegistry } from '../../../slot-registry';
import { resolverBloques } from '../../../blocks/resolve';
import { HeroBlock } from '../../../blocks/hero';
import { DEFAULT_LOCALE, LOCALE_HEADER, isSiteLocale } from '../../../i18n';

import type { Breadcrumb, MediaRef } from '@hwe-platform/core-ui';
import type { SiteLocale } from '../../../i18n';
import type { RoutableCollection } from '@hwe-platform/core-ui';
import type { Metadata } from 'next';

/**
 * Rótulos de interfaz de la página. No salen de Payload; van en el idioma del
 * cliente, que en el diseño de referencia pone «Accueil» como primer nivel de
 * las migas, no el nombre del site.
 */
const ROTULOS = { inicio: 'Accueil' };

type Args = {
  params: Promise<{ slug?: string[] }>;
};

/** Documento que ha respondido a la URL, con la colección de la que salió. */
type Resolved = {
  collection: RoutableCollection;
  doc: Record<string, unknown>;
};

/** Idioma activo, puesto por el middleware a partir del prefijo de la URL. */
async function currentLocale(): Promise<SiteLocale> {
  const headerList = await headers();
  const fromHeader = headerList.get(LOCALE_HEADER);
  return isSiteLocale(fromHeader) ? fromHeader : DEFAULT_LOCALE;
}

/**
 * Busca el documento que responde a una URL.
 *
 * Recorre las colecciones en el orden que fija `resolveRoute` y devuelve el
 * primero que coincide. La búsqueda es secuencial a propósito: para el volumen
 * de un site HWE (20-50 páginas) sobra, y la Local API va directa a la base de
 * datos sin pasar por HTTP (docs/arquitectura/paginas-routing.md).
 */
async function findDocument(
  params: { slug?: string[] },
  locale: SiteLocale,
): Promise<Resolved | null> {
  const payload = await getPayload({ config });
  const route = resolveRoute(params);

  if (route.kind === 'home') {
    const home = await payload.find({
      collection: 'pages',
      where: { type: { equals: 'home' } },
      locale,
      limit: 1,
    });
    const doc = home.docs[0];
    return doc ? { collection: 'pages', doc: doc as unknown as Record<string, unknown> } : null;
  }

  for (const collection of route.collections) {
    const found = await payload.find({
      collection,
      where: { slug: { equals: route.slug } },
      locale,
      limit: 1,
    });
    const doc = found.docs[0];
    if (doc) return { collection, doc: doc as unknown as Record<string, unknown> };
  }

  return null;
}

/**
 * Niveles máximos del rastro. Es un tope de seguridad por si alguien encadena
 * una página consigo misma desde el panel, no un límite de diseño.
 */
const MAX_NIVELES_MIGAS = 6;

/**
 * Rastro de migas de una página, subiendo por su cadena de padres.
 *
 * Se construye aquí y no en el bloque porque depende del modelo de datos —de
 * `pages.parent`—, mientras que el hero solo sabe pintar una lista.
 *
 * El último nivel es la página actual y va sin enlace, que es lo que marca
 * dónde estás.
 */
function breadcrumbsOf(doc: Record<string, unknown>, inicio: string): Breadcrumb[] {
  const migas: Breadcrumb[] = [];
  let actual: Record<string, unknown> | undefined = doc;

  for (let i = 0; i < MAX_NIVELES_MIGAS && actual !== undefined; i++) {
    const titulo = typeof actual.title === 'string' ? actual.title : undefined;
    if (titulo) migas.unshift({ label: titulo, url: `/${String(actual.slug ?? '')}` });

    const padre: unknown = actual.parent;
    actual =
      padre !== null && typeof padre === 'object' ? (padre as Record<string, unknown>) : undefined;
  }

  migas.unshift({ label: inicio, url: '/' });

  // El último nivel es la página actual: va sin enlace.
  const ultimo = migas[migas.length - 1];
  if (ultimo) delete ultimo.url;

  return migas;
}

/** Bloques del documento, si es una página con page builder. */
function blocksOf(resolved: Resolved) {
  const blocks = resolved.doc.blocks;
  return Array.isArray(blocks) ? blocks : [];
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const resolved = await findDocument(await params, await currentLocale());
  if (!resolved) return {};

  const seo = resolved.doc.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  const title = seo?.metaTitle ?? (resolved.doc.title as string) ?? (resolved.doc.name as string);

  return { title, description: seo?.metaDescription };
}

/**
 * Catch-all que resuelve cualquier URL contra Payload (DEC-009).
 *
 * Va con doble corchete porque `[...slug]` no captura la raíz, y dentro del
 * route group `(frontend)` para no chocar con `(payload)`.
 *
 * El hero se pinta aquí, una sola vez y antes de los bloques: **no es un bloque**
 * sino un grupo de campos de `pages`, así que no pasa por el registry.
 */
export default async function CatchAllPage({ params }: Args) {
  const locale = await currentLocale();
  const resolved = await findDocument(await params, locale);
  if (!resolved) notFound();

  if (resolved.collection !== 'pages') {
    // Los templates de ficha llegan en HU-011; de momento se confirma que la
    // URL resuelve y de qué colección salió.
    return (
      <p>
        {resolved.collection} · {String(resolved.doc.slug)} — template pendiente de HU-011.
      </p>
    );
  }

  const payload = await getPayload({ config });

  // `layout.tsx` envuelve las mismas lecturas para degradar en vez de tumbar
  // la página; esta ruta hacía lo contrario y un global sin configurar la
  // devolvía como 500.
  const siteConfig = await payload
    .findGlobal({ slug: 'site-config', depth: 1, locale })
    .catch(() => null);

  // Sin coerción: `HeroTitle` distingue «no hay nombre» de «nombre vacío»
  // para poder caer en el título del hero, y un `String(… ?? '')` siempre da
  // cadena, con lo que ese respaldo no se alcanzaba nunca.
  const siteName =
    typeof siteConfig?.general?.siteName === 'string' && siteConfig.general.siteName !== ''
      ? siteConfig.general.siteName
      : undefined;

  // El <main> lo pone SiteLayout: la página solo aporta su contenido.
  return (
    <>
      <HeroBlock
        data={resolved.doc.hero}
        breadcrumbs={breadcrumbsOf(resolved.doc, ROTULOS.inicio)}
        // Los tipos que genera Payload declaran opcional lo que el schema Zod
        // exige —`filename` puede ser null para Payload—, así que la frontera
        // entre ambos lleva un cast, igual que en `layout.tsx`.
        logoUrl={mediaUrl(siteConfig?.general?.logoInverted as MediaRef)}
        siteName={siteName}
      />
      <BlockRenderer
        blocks={await resolverBloques(payload, blocksOf(resolved), locale)}
        customRegistry={blockRegistry}
        slotRegistry={slotRegistry}
      />
    </>
  );
}

/**
 * Cada petición consulta Payload.
 *
 * El ISR que describe docs/arquitectura/paginas-routing.md no se puede montar
 * todavía: esta página lee por la Local API de Payload, que es acceso directo
 * a la base de datos y no un `fetch`, así que Next no puede etiquetar el
 * resultado por su cuenta. Sin etiquetas, lo que cachea no lo suelta nunca —
 * ni siquiera un 404 de una página que después se crea.
 *
 * Hacerlo bien exige `'use cache'` + `cacheTag()` de Next 16, que requiere
 * activar una bandera experimental que afectaría también al admin de Payload.
 * Es una decisión con alcance propio, y renderizar en cada petición es
 * correcto —solo más lento—, así que queda para cuando el rendimiento importe
 * de verdad (HU-012, el deploy). La infraestructura de invalidación ya está
 * lista desde HU-005: `revalidationTags()` calcula los tags y los hooks
 * `afterChange` los disparan.
 */
export const dynamic = 'force-dynamic';
