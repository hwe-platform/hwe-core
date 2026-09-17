import { describe, it, expect } from 'vitest';
import {
  compareFieldParity,
  mediaSchema,
  categorySchema,
  accommodationSchema,
  entitySchema,
  pageSchema,
  articleSchema,
} from '@hwe-platform/core-ui';

import { Media } from './Media';
import { Categories } from './Categories';
import { Accommodations } from './Accommodations';
import { Entities } from './Entities';
import { Pages } from './Pages';
import { Articles } from './Articles';

import type { ParityField } from '@hwe-platform/core-ui';
import type { CollectionConfig } from 'payload';

/**
 * Este test es lo que sostiene DEC-004 en la práctica.
 *
 * Los configs de Payload se escriben a mano porque los schemas Zod modelan la
 * forma de lectura y no llevan `localized`, `required`, labels ni destinos de
 * relación. A cambio, aquí se comprueba que ninguno de los dos lados se mueve
 * sin el otro: si alguien añade un campo al config y no al schema (o al revés),
 * este test falla y dice exactamente qué campo falta y dónde.
 *
 * Compara solo el primer nivel. La paridad dentro de grupos y arrays la cubre
 * el schema Zod al validar en el `beforeChange`.
 */

/** `id` lo asigna Payload en todas las colecciones. */
const AUTO = ['id'];

/** En una colección de uploads, Payload rellena además los metadatos del archivo. */
const UPLOAD_AUTO = [
  ...AUTO,
  'filename',
  'url',
  'mimeType',
  'filesize',
  'width',
  'height',
  'sizes',
];

/** Lo único que el test necesita de un schema Zod: sus claves de primer nivel. */
type SchemaConShape = { shape: Record<string, unknown> };

/** Un caso de paridad: el config de una colección frente a su schema. */
type CasoParidad = {
  nombre: string;
  config: CollectionConfig;
  schema: SchemaConShape;
  autoFields: string[];
};

const casos: CasoParidad[] = [
  { nombre: 'media', config: Media, schema: mediaSchema, autoFields: UPLOAD_AUTO },
  { nombre: 'categories', config: Categories, schema: categorySchema, autoFields: AUTO },
  {
    nombre: 'accommodations',
    config: Accommodations,
    schema: accommodationSchema,
    autoFields: AUTO,
  },
  { nombre: 'entities', config: Entities, schema: entitySchema, autoFields: AUTO },
  { nombre: 'pages', config: Pages, schema: pageSchema, autoFields: AUTO },
  { nombre: 'articles', config: Articles, schema: articleSchema, autoFields: AUTO },
];

describe('paridad entre los configs de Payload y los schemas Zod', () => {
  it.each(casos)('$nombre coincide con su schema', ({ config, schema, autoFields }) => {
    const result = compareFieldParity({
      schemaKeys: Object.keys(schema.shape),
      fields: config.fields as ParityField[],
      autoFields,
    });

    expect(result.missingInConfig, 'campos del schema que faltan en el config').toEqual([]);
    expect(result.missingInSchema, 'campos del config que faltan en el schema').toEqual([]);
  });
});
