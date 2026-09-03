import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';

import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Config base de Payload para site-demo. Sin colecciones de contenido
 * todavía (media, accommodations, entities, pages, articles, categories)
 * ni globals — llegan en HU-005, derivados de los schemas Zod de
 * @hwe-platform/core-ui (DEC-004).
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users],
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
