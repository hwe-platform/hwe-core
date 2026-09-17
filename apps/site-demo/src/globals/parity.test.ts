import { describe, it, expect } from 'vitest';
import {
  compareFieldParity,
  compareOptionParity,
  siteConfigSchema,
  headerSchema,
  footerSchema,
  bannerSchema,
} from '@hwe-platform/core-ui';

import { SiteConfig } from './SiteConfig';
import { Header } from './Header';
import { Footer } from './Footer';
import { Banner } from './Banner';

import type { ParityField } from '@hwe-platform/core-ui';
import type { GlobalConfig } from 'payload';

/**
 * Misma comprobación que para las colecciones (ver collections/parity.test.ts),
 * aplicada a los globals. No hay `autoFields`: los globals no tienen `id`.
 */

/** Lo único que el test necesita de un schema Zod: sus claves de primer nivel. */
type SchemaConShape = { shape: Record<string, unknown> };

/** Un caso de paridad: el config de un global frente a su schema. */
type CasoParidad = { nombre: string; config: GlobalConfig; schema: SchemaConShape };

const casos: CasoParidad[] = [
  { nombre: 'site-config', config: SiteConfig, schema: siteConfigSchema },
  { nombre: 'header', config: Header, schema: headerSchema },
  { nombre: 'footer', config: Footer, schema: footerSchema },
  { nombre: 'banner', config: Banner, schema: bannerSchema },
];

describe('paridad entre los globals de Payload y los schemas Zod', () => {
  it.each(casos)('$nombre coincide con su schema', ({ config, schema }) => {
    const result = compareFieldParity({
      schemaKeys: Object.keys(schema.shape),
      fields: config.fields as ParityField[],
    });

    expect(result.missingInConfig, 'campos del schema que faltan en el config').toEqual([]);
    expect(result.missingInSchema, 'campos del config que faltan en el schema').toEqual([]);
  });

  // Los nombres de campo coincidían y las **opciones** de un `select` no: el
  // panel ofrecía un valor que el schema rechazaba, y el fallo solo aparecía al
  // escribir, como un HTTP 400 lejos de su causa.
  it.each(casos)(
    'las opciones de los select de $nombre coinciden con su enum',
    ({ config, schema }) => {
      expect(compareOptionParity({ schema, fields: config.fields as ParityField[] })).toEqual([]);
    },
  );
});
