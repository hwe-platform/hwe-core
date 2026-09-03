import path from 'path';
import { fileURLToPath } from 'url';
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';
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
  // vercelPostgresAdapter usa el driver `pg` local automáticamente cuando no
  // corre en Vercel — funciona igual contra Postgres local o Docker.
  db: vercelPostgresAdapter({
    connectionString: process.env.POSTGRES_URL ?? '',
  }),
});
