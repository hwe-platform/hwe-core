import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { BlockRenderer, resolveRoute } from '@hwe-platform/core-ui';

import config from '../../../payload.config';
import { blockRegistry } from '../../../block-registry';
import { DEFAULT_LOCALE, LOCALE_HEADER, isSiteLocale } from '../../../i18n';

import type { SiteLocale } from '../../../i18n';
import type { RoutableCollection } from '@hwe-platform/core-ui';
import type { Metadata } from 'next';

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
 * El hero de las páginas todavía no se pinta: lo construye HU-009 junto con su
 * schema, para no hacerlo dos veces.
 */
export default async function CatchAllPage({ params }: Args) {
  const resolved = await findDocument(await params, await currentLocale());
  if (!resolved) notFound();

  if (resolved.collection !== 'pages') {
    // Los templates de ficha llegan en HU-011; de momento se confirma que la
    // URL resuelve y de qué colección salió.
    return (
      <main>
        <p>
          {resolved.collection} · {String(resolved.doc.slug)} — template pendiente de HU-011.
        </p>
      </main>
    );
  }

  return (
    <main>
      <BlockRenderer blocks={blocksOf(resolved)} customRegistry={blockRegistry} />
    </main>
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
