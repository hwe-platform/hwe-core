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

/** El logo es obligatorio en site-config, así que hace falta un media. */
async function ensureLogo() {
  const existing = await (await fetch(`${API}/media?limit=1`)).json();
  if (existing.docs?.[0]) return existing.docs[0].id;

  throw new Error(
    'No hay ningún archivo en media. Sube una imagen desde el panel antes de ejecutar el seed: ' +
      'site-config exige logo y logoInverted.',
  );
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
const logo = await ensureLogo();

console.log('Sembrando globals con los datos de La Civelle...\n');

await saveGlobal(
  'site-config',
  {
    general: {
      siteName: 'Camping La Civelle',
      siteDescription:
        'Camping 3 étoiles à Capbreton, au cœur de la forêt landaise, à 800 m des plages.',
      logo,
      logoInverted: logo,
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
      instagramHandle: '@camping_lacivelle',
    },
    payments: ['CB', 'Visa', 'Mastercard', 'Chèques vacances', 'ANCV'],
    legal: {
      links: [
        { label: 'CGV', url: '/cgv' },
        { label: 'Mentions légales', url: '/mentions-legales' },
        { label: 'RGPD', url: '/rgpd' },
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
    columns: [
      {
        title: 'Plan du site',
        type: 'links',
        links: [
          { label: 'Le Camping', url: '/le-camping' },
          { label: 'Nos Locations', url: '/locations' },
          { label: 'Restaurant', url: '/restaurant' },
        ],
      },
      {
        title: 'Infos Pratiques',
        type: 'links',
        links: [
          { label: 'Accès', url: '/acces' },
          { label: 'FAQ', url: '/faq' },
        ],
      },
    ],
    partners: [],
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
