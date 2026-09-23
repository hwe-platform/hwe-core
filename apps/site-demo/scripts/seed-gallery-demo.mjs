/**
 * Página de demostración de HU-011 — una Gallery por cada variante
 * (grid, masonry, collage, slider, slider-thumbs), con las tres de slider en
 * configuraciones distintas: clásico, fundido con autoplay, y multi-slide.
 * Todas con lightbox activado salvo una, que lo desactiva a propósito para
 * comprobar que `lightbox: false` de verdad no pinta ningún botón.
 *
 * Sube las seis fotos de la galería de «Mobile Home Confort» del export
 * (App.tsx:42-47, `figma-makes/la-civelle/src/app/MobileHomePage.tsx`) si no
 * están ya en la mediateca, y reutiliza las cuatro de «Découvrez les
 * alentours» que `seed-assets.mjs` ya sube — sus `alt` son literales del
 * mismo export en los dos casos (regla 1 de CLAUDE.md).
 *
 * La página no cuelga de la navegación: es solo para esta revisión. No toca
 * la home, que ya está aprobada visualmente (HU-009/010).
 *
 * Uso:
 *   node scripts/seed-gallery-demo.mjs            (credenciales del .env)
 *   node scripts/seed-gallery-demo.mjs <email> <contraseña>
 *
 * Es idempotente: reescribe la misma página por su slug, no acumula.
 */

import { readFile } from 'node:fs/promises';

const [, , argEmail, argPassword, base = 'http://localhost:3000'] = process.argv;

async function cargarEnv() {
  try {
    const contenido = await readFile(new URL('../.env', import.meta.url), 'utf8');
    for (const linea of contenido.split('\n')) {
      const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i.exec(linea);
      if (m) process.env[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* sin .env, se usan los argumentos */
  }
}

await cargarEnv();

const email = argEmail ?? process.env.PAYLOAD_SEED_EMAIL;
const password = argPassword ?? process.env.PAYLOAD_SEED_PASSWORD;

if (!email || !password) {
  console.error('Faltan credenciales: pásalas como argumentos o define PAYLOAD_SEED_* en el .env.');
  process.exit(1);
}

const API = `${base}/api`;
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const ASSETS = new URL('../../../../figma-makes/la-civelle/src/imports/', import.meta.url);

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!body.token) throw new Error(`No se pudo iniciar sesión (HTTP ${res.status})`);
  return body.token;
}

/** Id de un archivo ya subido, buscándolo por nombre. */
async function mediaId(nombre) {
  const query = new URLSearchParams({ where: JSON.stringify({ filename: { equals: nombre } }) });
  const res = await (await fetch(`${API}/media?limit=1&${query}`)).json();
  return res.docs?.[0]?.id;
}

/** Sube un archivo del export si no está ya en la mediateca. Devuelve su id. */
async function subirSiFalta(token, { origen, destino, tipo, alt }) {
  const existente = await mediaId(destino);
  if (existente) return existente;

  const datos = await readFile(new URL(origen, ASSETS));
  const form = new FormData();
  form.append('file', new Blob([datos], { type: tipo }), destino);
  form.append('_payload', JSON.stringify({ alt }));

  const res = await fetch(`${API}/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Subida fallida de ${destino}: HTTP ${res.status}`);
  console.log(`  subido     ${destino}`);
  return body.doc.id;
}

const token = await login();

// Galería «Mobile Home Confort», App.tsx:42-47 y 241/275 (alt literal "Vue N").
const fotosDelMobileHome = [];
for (let i = 1; i <= 6; i += 1) {
  const id = await subirSiFalta(token, {
    origen: `pict_10_${i}.jpg`,
    destino: `gallery-mobile-home-${i}.jpg`,
    tipo: 'image/jpeg',
    alt: `Vue ${i}`, // App.tsx:241,275
  });
  fotosDelMobileHome.push(id);
}

// Ya subidas por seed-assets.mjs — mismo alt literal, mismo archivo.
const fotoLocations = await mediaId('locations.png');
const fotoCapbreton = await mediaId('capbreton.png');
const fotoSurf = await mediaId('surf-plages.png');
const fotoPaysBasque = await mediaId('pays-basque.png');
const fotoGastronomia = await mediaId('gastronomie.png');

if (!fotoLocations || !fotoCapbreton || !fotoSurf || !fotoPaysBasque || !fotoGastronomia) {
  throw new Error('Faltan assets de la región. Ejecuta antes: node scripts/seed-assets.mjs');
}

console.log('\nSembrando la página de demo de Gallery...\n');

/** Una imagen de bloque Gallery, con su alt literal ya resuelto. */
const img = (image, alt) => ({ image, alt });

const bloques = [
  {
    blockType: 'gallery',
    title: 'Grid — Découvrez les alentours',
    description: 'Cuatro columnas, las fotos de región que ya usa la home en card-grid.',
    background: 'default',
    variant: 'grid',
    columns: 4,
    aspectRatio: '4/3',
    images: [
      img(fotoCapbreton, 'Capbreton'), // App.tsx:955
      img(fotoSurf, 'Surf & Plages'), // App.tsx:956
      img(fotoPaysBasque, 'Pays Basque'), // App.tsx:957
      img(fotoGastronomia, 'Gastronomie'), // App.tsx:958
    ],
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Masonry — Mobile Home Confort',
    description:
      'Ignora el aspectRatio configurado a propósito: cada foto mantiene su proporción real.',
    background: 'muted',
    variant: 'masonry',
    columns: 3,
    aspectRatio: '1/1', // a propósito: masonry lo ignora igualmente — es la prueba
    images: fotosDelMobileHome.map((id, i) => img(id, `Vue ${i + 1}`)),
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Collage — Nos Locations',
    description: 'Una imagen destacada y tres pequeñas alrededor, en CSS Grid.',
    background: 'default',
    variant: 'collage',
    aspectRatio: '4/3',
    images: [
      img(fotoLocations, 'Nos Locations'), // App.tsx:671 — la destacada
      img(fotoCapbreton, 'Capbreton'),
      img(fotoSurf, 'Surf & Plages'),
      img(fotoPaysBasque, 'Pays Basque'),
    ],
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Slider — clásico',
    description: 'Flechas + dots + loop. Una imagen a la vez, transición slide.',
    background: 'muted',
    variant: 'slider',
    aspectRatio: '16/9',
    lightbox: true,
    autoplay: false,
    loop: true,
    showDots: true,
    showArrows: true,
    effect: 'slide',
    slidesPerView: 1,
    images: [
      img(fotoCapbreton, 'Capbreton'),
      img(fotoSurf, 'Surf & Plages'),
      img(fotoPaysBasque, 'Pays Basque'),
      img(fotoGastronomia, 'Gastronomie'),
    ],
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Slider — fundido + autoplay',
    description: 'effect: fade, autoplay activo, sin dots — solo flechas.',
    background: 'default',
    variant: 'slider',
    aspectRatio: '4/3',
    lightbox: true,
    autoplay: true,
    autoplayDelay: 2500,
    loop: true,
    showDots: false,
    showArrows: true,
    effect: 'fade',
    images: fotosDelMobileHome.slice(0, 4).map((id, i) => img(id, `Vue ${i + 1}`)),
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Slider — multi-slide',
    description:
      'slidesPerView: 3, sin dots, y lightbox: false — la única sin ampliar al pulsar, a propósito.',
    background: 'muted',
    variant: 'slider',
    aspectRatio: '1/1',
    lightbox: false,
    autoplay: false,
    loop: true,
    showDots: false,
    showArrows: true,
    effect: 'slide',
    slidesPerView: 3,
    images: fotosDelMobileHome.map((id, i) => img(id, `Vue ${i + 1}`)),
    ctas: [],
  },
  {
    blockType: 'gallery',
    title: 'Slider-thumbs — Mobile Home Confort',
    description:
      'La variante estrella en hospitality: carrusel principal + barra de miniaturas sincronizada. Referencia real en el Figma (fiche alojamiento).',
    background: 'default',
    variant: 'slider-thumbs',
    aspectRatio: '16/9',
    lightbox: true,
    loop: true,
    showArrows: true,
    images: fotosDelMobileHome.map((id, i) => img(id, `Vue ${i + 1}`)), // App.tsx:241,275
    ctas: [],
  },
];

const SLUG = 'demo-hu011-gallery';

const filtro = new URLSearchParams({ where: JSON.stringify({ slug: { equals: SLUG } }) });
const existente = await (await fetch(`${API}/pages?limit=1&locale=fr&${filtro}`)).json();
const id = existente.docs?.[0]?.id;

const payload = {
  title: 'Démo HU-011 — Gallery',
  slug: SLUG,
  type: 'landing',
  blocks: bloques,
  seo: { noIndex: true },
};

const res = id
  ? await fetch(`${API}/pages/${id}?locale=fr`, {
      method: 'PATCH',
      headers: { ...JSON_HEADERS, Authorization: `JWT ${token}` },
      body: JSON.stringify(payload),
    })
  : await fetch(`${API}/pages?locale=fr`, {
      method: 'POST',
      headers: { ...JSON_HEADERS, Authorization: `JWT ${token}` },
      body: JSON.stringify(payload),
    });

const body = await res.json().catch(() => ({}));

console.log(
  res.ok
    ? `  OK    /${SLUG}: grid + masonry + collage + 3× slider + slider-thumbs\n\nListo. Visita http://localhost:3000/${SLUG}`
    : `  FALLO HTTP ${res.status}: ${JSON.stringify(body).slice(0, 800)}`,
);
process.exit(res.ok ? 0 : 1);
