import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Articles } from './collections/Articles';
import { Accommodations } from './collections/Accommodations';
import { Entities } from './collections/Entities';
import { Pages } from './collections/Pages';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Config base de Payload para site-demo. Las colecciones de contenido y los
 * globals se derivan de los schemas Zod de @hwe-platform/core-ui (DEC-004).
 *
 * TODO (Hito 5): antes de extraer estas colecciones a core-ui hay que revisar
 * qué campos son base obligatorio y cuáles extensión por tipo de web (camping,
 * hotel, etc.). Ver src/collections/README.md.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Accommodations, Entities, Pages, Articles],
  globals: [],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Adapter genérico de Postgres (driver `pg`): sirve igual para Postgres
  // local, Docker o gestionado. Se descartó @payloadcms/db-vercel-postgres
  // porque arrastra el SDK de @vercel/postgres, que obliga a llamar la
  // variable de conexión POSTGRES_URL y falla en bucle silencioso sin ella.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
});
