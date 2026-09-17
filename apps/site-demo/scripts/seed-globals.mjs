/**
 * Rellena los globals del site con los datos de La Civelle sacados del Figma.
 *
 * Se ejecuta contra el servidor en marcha, no con la Local API: cargar
 * payload.config fuera de Next deja el proceso colgado (ver la nota de
 * paginas-routing.md sobre la Local API).
 *
 * Uso:
 *   node scripts/seed-globals.mjs <email> <contraseña> [url]
 *
 * Es idempotente: vuelve a escribir los mismos valores, no acumula.
 */

import { readFile } from 'node:fs/promises';

import sharp from 'sharp';

const [, , email, password, base = 'http://localhost:3000'] = process.argv;

if (!email || !password) {
  console.error('Uso: node scripts/seed-globals.mjs <email> <contraseña> [url]');
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

/** Carpeta del export de Figma de la que salen los assets de marca. */
const ASSETS = new URL('../../../../figma-makes/la-civelle/src/imports/', import.meta.url);

/**
 * Sube un archivo a `media` si no está ya, y devuelve su id.
 *
 * La comparación es por nombre de archivo, que es lo que Payload guarda en
 * `filename`. Basta para que el seed sea idempotente; la detección de
 * duplicados por contenido es HU-014.
 */
async function subirMedia(nombre, alt, token, bytes) {
  const query = new URLSearchParams({ where: JSON.stringify({ filename: { equals: nombre } }) });
  const existe = await (await fetch(`${API}/media?limit=1&${query}`)).json();
  if (existe.docs?.[0]) return existe.docs[0].id;

  const datos = bytes ?? new Uint8Array(await readFile(new URL(nombre, ASSETS)));
  const form = new FormData();
  form.append('file', new Blob([datos], { type: 'image/png' }), nombre);
  form.append('_payload', JSON.stringify({ alt }));

  const res = await fetch(`${API}/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      `No se pudo subir ${nombre}: HTTP ${res.status} ${JSON.stringify(body).slice(0, 200)}`,
    );
  console.log(`  subido ${nombre}`);
  return body.doc.id;
}

/**
 * Sube las dos versiones del logo y devuelve sus ids.
 *
 * El export de Figma solo trae la versión **blanca** —por eso el diseño le
 * aplica `invert` cada vez que la pone sobre un fondo claro—. La versión para
 * fondo claro se genera aquí invirtiendo los canales de color y respetando el
 * alfa, en vez de dejar el filtro CSS en el componente: el logo es un dato del
 * cliente, y `core-ui` no debe saber de qué color viene el de cada uno.
 */
async function subirLogos(token) {
  const blanco = await readFile(new URL('site-logo.png', ASSETS));
  const oscuro = await sharp(blanco).negate({ alpha: false }).png().toBuffer();

  return {
    logo: await subirMedia('site-logo-dark.png', 'Camping La Civelle', token, oscuro),
    logoInverted: await subirMedia('site-logo.png', 'Camping La Civelle', token),
  };
}

/** Los seis sellos y partners que el diseño pone en el pie. */
async function subirPartners(token) {
  const nombres = Array.from({ length: 6 }, (_, i) => `partner_0${i + 1}.png`);
  const ids = [];
  for (const nombre of nombres) {
    ids.push({
      name: `Label ${nombre.slice(-5, -4)}`,
      logo: await subirMedia(nombre, 'Label partenaire', token),
    });
  }
  return ids;
}

async function saveGlobal(slug, data, token) {
  const res = await fetch(`${API}/globals/${slug}?locale=fr`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  console.log(
    res.ok
      ? `  OK    ${slug}`
      : `  FALLO ${slug}: HTTP ${res.status} ${JSON.stringify(body).slice(0, 300)}`,
  );
  return res.ok;
}

const token = await login();

console.log('Subiendo los assets de marca del export de Figma...\n');
const { logo, logoInverted } = await subirLogos(token);
const partners = await subirPartners(token);

console.log('\nSembrando globals con los datos de La Civelle...\n');

await saveGlobal(
  'site-config',
  {
    general: {
      siteName: 'Camping La Civelle',
      siteDescription:
        'Camping 3 étoiles à Capbreton, au cœur de la forêt landaise, à 800 m des plages.',
      logo,
      logoInverted,
      stars: 3,
      openingDates: 'Ouvert juillet & août · Sur réservation hors saison',
    },
    contact: {
      address: 'Route de la Plage',
      postalCode: '40130',
      city: 'Capbreton',
      country: 'France',
      phone: '05 58 72 12 34',
      email: 'contact@camping-lacivelle.com',
    },
    location: {
      latitude: 43.6417,
      longitude: -1.4297,
      transport: [
        { icon: 'car', label: 'Autoroute A63 — Sortie Capbreton / Hossegor' },
        { icon: 'train', label: 'Gare de Capbreton à 3 km' },
        { icon: 'plane', label: 'Aéroport Biarritz-Anglet à 35 km' },
      ],
    },
    languages: {
      available: ['fr', 'en', 'es'],
      default: 'fr',
      prefixDefault: false,
      strategy: 'prefix',
    },
    social: {
      instagram: 'https://instagram.com/camping_lacivelle',
      facebook: 'https://facebook.com/campinglacivelle',
      youtube: 'https://youtube.com/@campinglacivelle',
      linkedin: 'https://linkedin.com/company/camping-la-civelle',
      tiktok: 'https://tiktok.com/@camping_lacivelle',
      instagramHandle: '@camping_lacivelle',
    },
    payments: ['CB', 'Visa', 'Mastercard', 'Chèques vacances', 'ANCV'],
    legal: {
      links: [
        { label: 'CGV', url: '/cgv' },
        { label: 'CGU', url: '/cgu' },
        { label: 'Mentions légales', url: '/mentions-legales' },
        { label: 'RGPD', url: '/rgpd' },
        { label: 'Gestion des cookies', url: '/cookies' },
        { label: 'Règlement intérieur', url: '/reglement-interieur' },
      ],
    },
    tracking: {},
    customCode: [],
    booking: { engine: 'mastercamping' },
  },
  token,
);

await saveGlobal(
  'header',
  {
    topBar: {
      links: [
        { label: 'Aide', icon: 'help', url: '/aide' },
        { label: 'Contact', icon: 'phone', url: '/contact' },
        { label: 'Webcams', icon: 'video', url: '/webcams' },
        { label: 'Se connecter', icon: 'user', url: '/compte' },
      ],
      showLogin: true,
      bookingButtonLabel: 'Réserver',
    },
    navigation: [
      { label: 'Le Camping', url: '/le-camping' },
      {
        label: 'Nos Emplacements',
        url: '/emplacements',
        children: [
          { label: 'Cyclo Rando', url: '/emplacements/cyclo-rando' },
          { label: 'Confort', url: '/emplacements/confort' },
          { label: 'Camping-car', url: '/emplacements/camping-car' },
          { label: 'Privilège', url: '/emplacements/privilege' },
        ],
      },
      {
        label: 'Nos Locations',
        url: '/locations',
        children: [
          { label: 'Mobile Home Confort 3 ch.', url: '/locations/mobile-home-confort' },
          { label: 'Cottage Premium 3 ch.', url: '/locations/cottage-premium' },
        ],
      },
      { label: 'Activités & Services', url: '/activites-services' },
      { label: 'Restaurant', url: '/restaurant' },
      { label: 'La Piscine', url: '/piscine' },
      {
        label: 'Infos Pratiques',
        url: '/infos-pratiques',
        children: [
          { label: 'Application mobile', url: '/infos-pratiques/application-mobile' },
          { label: 'Plan du camping', url: '/infos-pratiques/plan-du-camping' },
          { label: 'Tarifs 2026', url: '/infos-pratiques/tarifs' },
          { label: 'Nos engagements', url: '/infos-pratiques/nos-engagements' },
          { label: 'FAQ', url: '/infos-pratiques/faq' },
          { label: 'Nos Labels', url: '/infos-pratiques/nos-labels' },
        ],
      },
      {
        // Nueve hijos: es la entrada que dispara el desplegable a dos columnas.
        label: 'Tourisme',
        url: '/tourisme',
        children: [
          { label: 'Capbreton', url: '/tourisme/capbreton' },
          { label: 'Hossegor', url: '/tourisme/hossegor' },
          { label: 'Activités en famille', url: '/tourisme/activites-en-famille' },
          { label: 'Surf & Plages', url: '/tourisme/surf-et-plages' },
          { label: 'Idées pluie', url: '/tourisme/idees-pluie' },
          { label: 'Excursions Pays Basque', url: '/tourisme/pays-basque' },
          { label: 'Gastronomie & marchés', url: '/tourisme/gastronomie' },
          { label: 'CIRKWI', url: '/tourisme/cirkwi' },
          { label: "Agenda de l'été", url: '/tourisme/agenda' },
        ],
      },
    ],
  },
  token,
);

await saveGlobal(
  'footer',
  {
    virtualAssistant: {
      enabled: true,
      title: 'Votre assistant virtuel',
      subtitle: 'Une question sur votre séjour ? Réponse immédiate 24h/24',
      placeholder: 'Comment puis-je vous aider ?',
    },
    // Las cuatro columnas del diseño, en su orden. La quinta del Figma —el
    // contacto— no va aquí: el pie la arma desde site-config, que es su fuente
    // única (specs/payload/modelo-datos.md).
    columns: [
      {
        title: 'Plan du site',
        type: 'links',
        links: [
          { label: 'Le Camping', url: '/le-camping' },
          { label: 'Nos Emplacements', url: '/emplacements' },
          { label: 'Nos Locations', url: '/locations' },
          { label: 'Activités & Services', url: '/activites-services' },
          { label: 'Restaurant', url: '/restaurant' },
          { label: 'La Piscine', url: '/piscine' },
          { label: 'Infos Pratiques', url: '/infos-pratiques' },
          { label: 'Tourisme', url: '/tourisme' },
        ],
      },
      {
        title: 'Autres pages',
        type: 'links',
        links: [
          { label: 'Galerie Média', url: '/galerie' },
          { label: 'Espace Propriétaire', url: '/espace-proprietaire' },
          { label: 'Actualités / Blog', url: '/actualites' },
          { label: 'Contact', url: '/contact' },
          { label: "Offres d'emploi", url: '/emploi' },
          { label: 'Plan du site', url: '/plan-du-site' },
        ],
      },
      {
        title: 'Infos Pratiques',
        type: 'links',
        links: [
          { label: 'Application mobile', url: '/application-mobile' },
          { label: 'Plan interactif', url: '/plan-interactif' },
          { label: 'Nos Engagements', url: '/nos-engagements' },
          { label: 'FAQ', url: '/faq' },
          { label: 'Météo', url: '/meteo' },
        ],
      },
      {
        title: 'Newsletter',
        type: 'newsletter',
        newsletter: {
          description: "Offres spéciales, agenda d'été et nouveautés",
          buttonLabel: "S'inscrire",
          provider: 'custom',
          actionUrl: '/newsletter',
        },
      },
    ],
    partners,
    copyright: '© 2026 Camping La Civelle — Tous droits réservés',
  },
  token,
);

await saveGlobal(
  'banner',
  {
    enabled: true,
    message: 'Ouvert juillet & août · Sur réservation hors saison',
    type: 'info',
    dismissible: true,
  },
  token,
);

console.log('\nListo. Recarga http://localhost:3000');
