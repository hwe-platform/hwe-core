/**
 * Siembra la home con el contenido real del Figma de La Civelle, para poder
 * comparar lo construido con el diseño en lugar de con datos inventados.
 *
 * **Todo el texto es literal del export, con su cita** — regla 1 de
 * CLAUDE.md. La primera versión de este script resumió los párrafos "para
 * que cupieran" y le puso a la intro un botón que el diseño no lleva; el
 * Reviewer lo cazó contrastando línea a línea. Texto parecido es texto
 * inventado.
 *
 * Uso:
 *   node scripts/seed-home.mjs            (credenciales del .env)
 *   node scripts/seed-home.mjs <email> <contraseña>
 *
 * Es idempotente: reescribe la misma página, no acumula.
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

/** Máscara de negrita de Lexical. Los formatos son bits y se acumulan. */
const NEGRITA = 1;

/** Un tramo de texto. `negrita` marca lo que el export pone en `<strong>`. */
const t = (text, negrita = false) => ({
  type: 'text',
  text,
  format: negrita ? NEGRITA : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
});

/**
 * Un cuerpo de texto en el formato que Payload guarda para Lexical.
 *
 * Cada párrafo es una lista de tramos, para poder reproducir las negritas del
 * export: sin eso el diseño pierde los énfasis que sí lleva.
 */
function cuerpo(...parrafos) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: parrafos.map((tramos) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: tramos,
      })),
    },
  };
}

const token = await login();

const video = await media('hero-camping.mp4');
const fotoEmplazamientos = await media('emplacements.png');
const fotoPiscina = await media('piscine.png');
const fotoAlojamientos = await media('locations.png');
const fotoCapbreton = await media('capbreton.png');
const fotoSurf = await media('surf-plages.png');
const fotoPaysBasque = await media('pays-basque.png');
const fotoGastronomia = await media('gastronomie.png');

const fotosDeLaRegion = [fotoCapbreton, fotoSurf, fotoPaysBasque, fotoGastronomia];

if (
  !video ||
  !fotoEmplazamientos ||
  !fotoPiscina ||
  !fotoAlojamientos ||
  fotosDeLaRegion.some((foto) => !foto)
) {
  throw new Error('Faltan assets. Ejecuta antes: node scripts/seed-assets.mjs');
}

console.log('Sembrando la home con el contenido del Figma...\n');

// Buscada por `type`, no por «la primera que salga»: con `?limit=1` a secas
// el script le machacaba el contenido a una página cualquiera en cuanto
// hubiera más de una.
const filtro = new URLSearchParams({ where: JSON.stringify({ type: { equals: 'home' } }) });
const pagina = await (await fetch(`${API}/pages?limit=1&locale=fr&${filtro}`)).json();
const id = pagina.docs?.[0]?.id;
if (!id) throw new Error('No hay ninguna página con type "home" que actualizar.');

/**
 * Hero de la home — App.tsx:466-503.
 *
 * Vídeo de fondo, el logo haciendo de titular y la línea de localización como
 * supertítulo. El `<h1>` se pinta oculto: el export deja esta página sin
 * encabezado legible y eso no se copia.
 */
const hero = {
  variant: 'video',
  media: video,
  eyebrow: 'Capbreton · Landes · Atlantique', // App.tsx:495
  title: 'Camping La Civelle', // alt del logo, App.tsx:500
  titleMode: 'logo',
  align: 'center',
  showBreadcrumbs: false,
};

/**
 * Los dos usos de imagen + texto que mejor enseñan los ejes, con su texto
 * literal del export.
 *
 * El primero es la sección *intro* (App.tsx:546-566): medio a cinco columnas
 * de doce, alineado arriba y **sin botón** — el diseño no lo lleva. El segundo
 * es *La Piscine* (App.tsx:837-880): invertida, centrada, medio a siete y un
 * único CTA.
 *
 * El titular de la intro va partido en dos: `title` es la primera línea y
 * `titleAccent` la segunda, que el bloque pinta en dorado.
 */
const bloques = [
  {
    blockType: 'media-text',
    subtitle: 'Camping 3 étoiles · Capbreton · Landes', // App.tsx:550
    title: 'Bienvenue au Camping La Civelle,', // App.tsx:553
    titleAccent: 'votre camping à Capbreton au cœur des Landes', // App.tsx:554
    background: 'default', // bg-card — App.tsx:520
    slotId: 'intro-medallion', // la insignia «Depuis 30 Ans» — App.tsx:536-541
    content: cuerpo(
      // App.tsx:558-562
      [
        t('Niché au cœur de la forêt landaise, le '),
        t('Camping La Civelle', true),
        t(' vous accueille à '),
        t('Capbreton', true),
        t(", à seulement 800 mètres des plages de l'Atlantique."),
      ],
      // App.tsx:564-566
      [
        t(
          "Ce domaine de 11 hectares de pins maritimes est un sanctuaire où la nature, le calme et la convivialité se conjuguent pour des vacances inoubliables. Que vous soyez en famille, en couple ou entre amis, notre camping landais est le point de départ idéal pour découvrir la Côte d'Argent et le Pays Basque.",
        ),
      ],
    ),
    media: 'image',
    image: fotoEmplazamientos,
    split: 5,
    reverse: false,
    align: 'start',
    ratio: 'portrait',
    ctas: [],
  },
  {
    // «Pourquoi choisir La Civelle» — App.tsx:597-648.
    // Tres iconos sueltos, sin tarjeta, sobre el fondo de sección.
    blockType: 'icon-grid',
    subtitle: 'Notre esprit', // App.tsx:601
    title: 'Pourquoi choisir La Civelle ?', // App.tsx:604
    headingTone: 'brand', // text-primary — App.tsx:607; las otras tres secciones van en text-foreground
    background: 'default', // bg-card — App.tsx:597
    columns: 3, // App.tsx:612
    variant: 'bare',
    items: [
      {
        icon: 'treePine', // App.tsx:616
        label: 'Au cœur de la forêt landaise', // App.tsx:617
        description:
          "11 hectares de nature préservée pour un séjour ressourçant. Pins maritimes, senteurs sylvestres, calme absolu. Notre camping dans les Landes est classé parmi les meilleurs sites naturels de la Côte d'Argent.", // App.tsx:618
      },
      {
        icon: 'waves', // App.tsx:621
        label: "À 800 m des plages de l'Atlantique", // App.tsx:622
        description:
          "Rejoignez les plages de Capbreton à pied ou en vélo en moins de 10 minutes. Surf, baignade et farniente sur le sable fin de la Côte d'Argent à deux pas de votre emplacement ou de votre location.", // App.tsx:623
      },
      {
        icon: 'espritFamilial', // SVG propio del cliente — App.tsx:625
        label: 'Esprit familial & convivial', // App.tsx:626
        description:
          "Camping à taille humaine tenu par une équipe passionnée depuis plus de 30 ans. Restaurant, piscine chauffée, animations d'été — tout est réuni pour que chaque membre de la famille reparte avec de beaux souvenirs.", // App.tsx:627
      },
    ],
    ctas: [],
  },
  {
    // «Nos Hébergements» — App.tsx:650-698.
    // El único reparto asimétrico del diseño: dos tarjetas a 5 y 7 de doce,
    // con el texto sobre la imagen.
    blockType: 'card-grid',
    subtitle: 'Hébergements', // App.tsx:659
    title: 'Nos Hébergements', // App.tsx:662
    description:
      "Du simple emplacement nature aux cottages premium, trouvez l'hébergement qui vous convient.", // App.tsx:665
    background: 'muted', // bg-muted/40 — App.tsx:655
    card: 'overlay',
    columns: 2,
    spans: [5, 7], // App.tsx:670-671
    source: 'manual',
    items: [
      {
        image: fotoEmplazamientos,
        title: 'Nos Emplacements', // App.tsx:670
        subtitle: 'Cyclo Rando · Confort · Camping-car · Privilège', // App.tsx:670
        url: '/emplacements',
        readMoreLabel: 'Découvrir', // App.tsx:688
        variant: 'primary', // botón relleno — App.tsx:687
      },
      {
        image: fotoAlojamientos,
        title: 'Nos Locations', // App.tsx:671
        subtitle: 'Mobile Home Confort 3 ch · Cottage Premium 3 ch', // App.tsx:671
        url: '/mobile-home-confort',
        readMoreLabel: 'Découvrir', // App.tsx:688
        variant: 'primary', // botón relleno — App.tsx:687
      },
    ],
    ctas: [],
  },
  {
    blockType: 'media-text',
    subtitle: 'Baignade & Détente', // App.tsx:839
    title: 'La Piscine', // App.tsx:842
    background: 'default', // bg-card — App.tsx:835
    content: cuerpo([
      // App.tsx:845-847
      t(
        "Piscine chauffée entourée de transats et d'espaces ombragés. Bassin principal 15 × 8 m, pataugeoire pour les petits et cours d'aquagym en juillet-août.",
      ),
    ]),
    media: 'image',
    image: fotoPiscina,
    split: 7,
    reverse: true,
    align: 'center',
    ratio: 'landscape',
    // El CTA del diseño lleva flecha a la derecha (App.tsx:870).
    ctas: [{ label: 'En savoir plus', url: '/piscine', variant: 'primary', icon: 'arrowRight' }],
  },
  {
    // «Activités & Services» — App.tsx:883-935.
    // Seis iconos, cada uno en su tarjeta, y el botón de sección debajo.
    blockType: 'icon-grid',
    subtitle: 'Sur place', // App.tsx:887
    title: 'Activités & Services', // App.tsx:890
    description:
      'Tout ce dont vous avez besoin pour des vacances réussies, sans quitter le camping.', // App.tsx:893
    background: 'muted', // bg-muted/40 — App.tsx:883
    columns: 6, // App.tsx:901
    variant: 'card',
    items: [
      { icon: 'shoppingBag', label: 'Épicerie' }, // App.tsx:903
      { icon: 'bike', label: 'Location de vélos' }, // App.tsx:904
      { icon: 'refreshCcw', label: 'Laverie' }, // App.tsx:905
      { icon: 'leaf', label: 'Loisirs nature' }, // App.tsx:906
      { icon: 'flame', label: 'Barbecues' }, // App.tsx:907
      { icon: 'animationsEte', label: "Animations d'été" }, // SVG propio — App.tsx:908
    ],
    ctas: [
      {
        label: 'Voir tous les services', // App.tsx:929
        url: '/services',
        variant: 'primary',
        icon: 'arrowRight',
      },
    ],
  },
  {
    // «Découvrez les alentours» — App.tsx:941-975.
    // Cuatro tarjetas con el texto sobre la imagen, en la escala pequeña: la
    // otra sección overlay del diseño, y la que prueba el eje `cardSize`.
    blockType: 'card-grid',
    subtitle: 'La région', // App.tsx:945
    title: 'Découvrez les alentours', // App.tsx:948
    headingTone: 'brand', // text-primary — App.tsx:947
    description: 'Côte landaise, Pays Basque, surf et gastronomie à deux pas', // App.tsx:951
    background: 'default', // bg-card — App.tsx:941
    card: 'overlay',
    cardSize: 'compact', // h-[320px] md:h-[420px] lg:h-[540px] — App.tsx:960
    columns: 4, // App.tsx:954
    spans: [],
    source: 'manual',
    items: [
      {
        image: fotoCapbreton,
        title: 'Capbreton', // App.tsx:955
        tag: 'Village & port', // App.tsx:955
        url: '/capbreton',
        readMoreLabel: 'Découvrir', // App.tsx:970
        variant: 'link', // enlace suelto, sin caja — App.tsx:970
      },
      {
        image: fotoSurf,
        title: 'Surf & Plages', // App.tsx:956
        tag: 'Atlantique', // App.tsx:956
        url: '/surf-plages',
        readMoreLabel: 'Découvrir', // App.tsx:970
        variant: 'link',
      },
      {
        image: fotoPaysBasque,
        title: 'Pays Basque', // App.tsx:957
        tag: 'Excursions', // App.tsx:957
        url: '/pays-basque',
        readMoreLabel: 'Découvrir', // App.tsx:970
        variant: 'link',
      },
      {
        image: fotoGastronomia,
        title: 'Gastronomie', // App.tsx:958
        tag: 'Marchés & saveurs', // App.tsx:958
        url: '/gastronomie',
        readMoreLabel: 'Découvrir', // App.tsx:970
        variant: 'link',
      },
    ],
    ctas: [],
  },
  {
    // «Actualités» — App.tsx:985-1058.
    // Bloque de referencia: no lleva los artículos, lleva la consulta. Los
    // resuelve el site antes de pintar.
    blockType: 'blog',
    subtitle: 'Blog', // App.tsx:990
    title: 'Actualités', // App.tsx:993
    background: 'muted', // bg-muted/40 — App.tsx:985
    source: 'latest',
    limit: 3, // tres tarjetas — App.tsx:1000
    showMoreLink: true,
    showMoreUrl: '/actualites',
    showMoreLabel: 'Voir toutes les actualités', // App.tsx:1054
  },
];

const res = await fetch(`${API}/pages/${id}?locale=fr`, {
  method: 'PATCH',
  headers: { ...JSON_HEADERS, Authorization: `JWT ${token}` },
  body: JSON.stringify({ hero, blocks: bloques }),
});
const body = await res.json().catch(() => ({}));

console.log(
  res.ok
    ? '  OK    home: hero de vídeo + dos bloques imagen/texto\n\nListo. Recarga http://localhost:3000'
    : `  FALLO HTTP ${res.status}: ${JSON.stringify(body).slice(0, 500)}`,
);
process.exit(res.ok ? 0 : 1);
