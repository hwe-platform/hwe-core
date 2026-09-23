/**
 * Siembra cuatro artículos para que el bloque `blog` tenga qué enseñar.
 *
 * **Los títulos, categorías y fechas son literales del export** (`App.tsx:990-1058`),
 * que es lo único que el diseño da de la sección «Actualités»: sus tarjetas
 * solo muestran esas tres cosas. El cuarto artículo sale de la lista de
 * HU-010.
 *
 * **Los resúmenes y los cuerpos son ficticios**, escritos para esta demo con
 * el visto bueno de la humana: no existen en el Figma ni en ninguna otra
 * fuente, y la colección los exige. No son contenido del cliente y no deben
 * tratarse como tal — si La Civelle entra en producción, se sustituyen.
 *
 * Uso:
 *   node scripts/seed-articles.mjs            (credenciales del .env)
 *   node scripts/seed-articles.mjs <email> <contraseña>
 *
 * Es idempotente: busca cada artículo por su slug y lo reescribe.
 */

import { readFile } from 'node:fs/promises';

const [, , argEmail, argPassword, base = 'http://localhost:3000'] = process.argv;

/** Lee el `.env` del site; aquí no hay Next que lo cargue por nosotros. */
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
async function media(nombre) {
  const query = new URLSearchParams({ where: JSON.stringify({ filename: { equals: nombre } }) });
  const res = await (await fetch(`${API}/media?limit=1&${query}`)).json();
  return res.docs?.[0]?.id;
}

/** Un cuerpo de texto en el formato que Payload guarda para Lexical. */
function cuerpo(...parrafos) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: parrafos.map((texto) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            text: texto,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      })),
    },
  };
}

const token = await login();

const fotoEmplazamientos = await media('emplacements.png');
const fotoPiscina = await media('piscine.png');
const fotoRestaurante = await media('restaurant.png');
const fotoAlojamientos = await media('locations.png');

if (!fotoEmplazamientos || !fotoPiscina || !fotoRestaurante || !fotoAlojamientos) {
  throw new Error('Faltan assets. Ejecuta antes: node scripts/seed-assets.mjs');
}

const articulos = [
  {
    // Título, categoría y fecha: App.tsx:995-997
    slug: 'nouvelle-saison-2026',
    title: 'Nouvelle saison 2026 : toutes les nouveautés',
    category: 'Camping',
    publishedAt: '2026-03-15T09:00:00.000Z',
    image: fotoEmplazamientos,
    featured: true,
    excerpt:
      "Nouveaux emplacements ombragés, espace bien-être et horaires élargis pour l'épicerie : voici ce qui change cette année.",
    content: cuerpo(
      "La saison 2026 ouvre le 4 avril et s'annonce comme la plus complète depuis l'agrandissement du domaine.",
      "Quinze nouveaux emplacements Privilège bordent désormais la pinède, avec raccordement individuel et plus d'ombre aux heures chaudes. L'épicerie ouvre dès 8h en juillet et août.",
      'Les réservations sont ouvertes, et les séjours de plus de sept nuits bénéficient du tarif longue durée.',
    ),
  },
  {
    // Título, categoría y fecha: App.tsx:1001-1003
    slug: 'meilleures-plages-capbreton',
    title: 'Les meilleures plages autour de Capbreton',
    category: 'Tourisme',
    publishedAt: '2026-03-10T09:00:00.000Z',
    image: fotoPiscina,
    featured: false,
    excerpt:
      'Du Prévent à la Piste, quatre plages accessibles à pied ou à vélo depuis le camping, avec leurs horaires de surveillance.',
    content: cuerpo(
      'La plage du Prévent est la plus proche : huit cents mètres par le chemin piéton, surveillée de juin à septembre.',
      'Plus au nord, la Piste attire les surfeurs au lever du jour. Notre conseil : partir tôt, se garer au camping et finir à vélo.',
    ),
  },
  {
    // Título, categoría y fecha: App.tsx:1007-1009
    slug: 'recette-gateau-basque',
    title: 'Recette du week-end : Gâteau basque',
    category: 'Gastronomie',
    publishedAt: '2026-03-05T09:00:00.000Z',
    image: fotoRestaurante,
    featured: false,
    excerpt:
      'La recette que prépare notre cuisine le dimanche, avec la crème pâtissière à la vanille de la maison.',
    content: cuerpo(
      'Le gâteau basque se prépare la veille : la pâte doit reposer au frais au moins six heures.',
      'Garnissez de crème pâtissière ou de confiture de cerises noires, selon la tradition de la vallée.',
    ),
  },
  {
    // Cuarto artículo, de la lista de HU-010
    slug: 'journee-en-famille',
    title: 'Journée en famille : activités pour petits et grands',
    category: 'Famille',
    publishedAt: '2026-02-28T09:00:00.000Z',
    image: fotoAlojamientos,
    featured: true,
    excerpt:
      "Une journée type au camping, du réveil en douceur à l'animation du soir, sans jamais prendre la voiture.",
    content: cuerpo(
      "Le matin, la piscine chauffée ouvre à 10h et reste calme jusqu'au déjeuner.",
      "L'après-midi, le club enfants propose des ateliers nature ; les parents profitent des transats ombragés.",
      "Le soir, l'animation se tient sur la terrasse du restaurant, en musique et sans réservation.",
    ),
  },
];

console.log('Sembrando los artículos del blog...\n');

let fallos = 0;

for (const articulo of articulos) {
  const query = new URLSearchParams({ where: JSON.stringify({ slug: { equals: articulo.slug } }) });
  const existente = await (await fetch(`${API}/articles?limit=1&locale=fr&${query}`)).json();
  const id = existente.docs?.[0]?.id;

  const res = await fetch(id ? `${API}/articles/${id}?locale=fr` : `${API}/articles?locale=fr`, {
    method: id ? 'PATCH' : 'POST',
    headers: { ...JSON_HEADERS, Authorization: `JWT ${token}` },
    body: JSON.stringify(articulo),
  });

  if (res.ok) {
    console.log(`  OK    ${articulo.title}`);
  } else {
    fallos += 1;
    const body = await res.json().catch(() => ({}));
    console.log(
      `  FALLO ${articulo.title} — HTTP ${res.status}: ${JSON.stringify(body).slice(0, 300)}`,
    );
  }
}

console.log(
  fallos === 0 ? '\nListo. Recarga http://localhost:3000' : `\n${fallos} artículo(s) sin sembrar.`,
);
process.exit(fallos === 0 ? 0 : 1);
