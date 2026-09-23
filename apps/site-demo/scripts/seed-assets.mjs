/**
 * Sube a la mediateca las fotos y el vídeo del export de Figma.
 *
 * Los archivos del export tienen **nombre de hash**, sin significado. El texto
 * alternativo se deduce de **dónde se usa cada imagen en el código**, no del
 * nombre: el export las importa como `imgPiscineImg`, `imgRestaurantImg`… y ahí
 * está la información que el fichero no lleva (`specs/figma/analisis.md`,
 * punto 5).
 *
 * Uso:
 *   node scripts/seed-assets.mjs            (credenciales del .env)
 *   node scripts/seed-assets.mjs <email> <contraseña>
 *
 * Es idempotente: no vuelve a subir lo que ya está, pero sí corrige su `alt`.
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
  console.error('Faltan credenciales: argumentos o PAYLOAD_SEED_* en el .env.');
  process.exit(1);
}

const API = `${base}/api`;
const ASSETS = new URL('../../../../figma-makes/la-civelle/src/imports/', import.meta.url);

/**
 * Qué subir, con el `alt` literal del export y su cita (regla 1 de CLAUDE.md).
 *
 * `destino` es el nombre con el que se guarda: los hashes no dicen nada y
 * dejarlos convertiría la mediateca en un vertedero imposible de buscar.
 */
const ARCHIVOS = [
  {
    origen: 'FILM_20MO_COMPLICES.mp4',
    destino: 'hero-camping.mp4',
    tipo: 'video/mp4',
    alt: 'Vidéo du camping', // sin alt en el export: fondo decorativo; lo decidió la humana
  },
  {
    origen: 'AccueilImages/e7c2cf6672d47127a07894afd505fe855b2fcf69.png',
    destino: 'emplacements.png',
    tipo: 'image/png',
    alt: 'Nature au Camping La Civelle', // App.tsx:529
  },
  {
    origen: 'AccueilImages/aa7559c955e11b7d45004f4a4d265e6a3a1316f6.png',
    destino: 'piscine.png',
    tipo: 'image/png',
    alt: 'La Piscine', // App.tsx:877
  },
  {
    origen: 'AccueilImages/fe7f2da4b71b0d030d544ae57f12bab1211afc66.png',
    destino: 'restaurant.png',
    tipo: 'image/png',
    alt: 'Le Restaurant', // App.tsx:782
  },
  {
    origen: 'AccueilImages/18d4b7475b387b4d1cbbf4d064c592999b2228c1.png',
    destino: 'locations.png',
    tipo: 'image/png',
    alt: 'Nos Locations', // App.tsx:672
  },
  // «Découvrez les alentours»: el export pinta cada foto con el título de su
  // tarjeta de `alt` (`alt={dest.title}`, App.tsx:961), así que el texto
  // alternativo es literal y no deducido.
  {
    origen: 'AccueilImages/3905d8f65b77c42d61c8f03efa56744d872db131.png',
    destino: 'capbreton.png',
    tipo: 'image/png',
    alt: 'Capbreton', // App.tsx:955
  },
  {
    origen: 'AccueilImages/54966417f791800c03035ed49176be8d447c5a50.png',
    destino: 'surf-plages.png',
    tipo: 'image/png',
    alt: 'Surf & Plages', // App.tsx:956
  },
  {
    origen: 'AccueilImages/4965a4264036c4060463ad110ac976c7929e2135.png',
    destino: 'pays-basque.png',
    tipo: 'image/png',
    alt: 'Pays Basque', // App.tsx:957
  },
  {
    origen: 'AccueilImages/94c5ba2a851bd7fcb4895cb2b96ab3af8333ef94.png',
    destino: 'gastronomie.png',
    tipo: 'image/png',
    alt: 'Gastronomie', // App.tsx:958
  },
];

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!body.token) throw new Error(`No se pudo iniciar sesión (HTTP ${res.status})`);
  return body.token;
}

const token = await login();

for (const archivo of ARCHIVOS) {
  const query = new URLSearchParams({
    where: JSON.stringify({ filename: { equals: archivo.destino } }),
  });
  const existe = await (await fetch(`${API}/media?limit=1&${query}`)).json();
  if (existe.docs?.[0]) {
    // El archivo no se vuelve a subir, pero el alt sí se corrige: es el dato
    // que llega al navegador, y la primera versión de este script lo inventó.
    const doc = existe.docs[0];
    if (doc.alt !== archivo.alt) {
      const res = await fetch(`${API}/media/${doc.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ alt: archivo.alt }),
      });
      console.log(`  ${res.ok ? 'alt fijado' : 'FALLO alt '} ${archivo.destino}`);
    } else {
      console.log(`  ya estaba  ${archivo.destino}`);
    }
    continue;
  }

  let datos;
  try {
    datos = await readFile(new URL(archivo.origen, ASSETS));
  } catch {
    console.log(`  NO EXISTE  ${archivo.origen}`);
    continue;
  }

  const form = new FormData();
  form.append('file', new Blob([datos], { type: archivo.tipo }), archivo.destino);
  form.append('_payload', JSON.stringify({ alt: archivo.alt }));

  const res = await fetch(`${API}/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));

  console.log(
    res.ok
      ? `  subido     ${archivo.destino}  (${(datos.length / 1048576).toFixed(1)} MB)`
      : `  FALLO      ${archivo.destino}: HTTP ${res.status} ${JSON.stringify(body).slice(0, 200)}`,
  );
}

console.log('\nListo.');
