import { describe, it, expect } from 'vitest';
import {
  compareFieldParity,
  mediaSchema,
  categorySchema,
  articleSchema,
} from '@hwe-platform/core-ui';

import { Media } from './Media';
import { Categories } from './Categories';
import { Articles } from './Articles';

import type { ParityField } from '@hwe-platform/core-ui';

/**
 * Este test es lo que sostiene DEC-004 en la práctica.
 *
 * Los configs de Payload se escriben a mano porque los schemas Zod modelan la
 * forma de lectura y no llevan `localized`, `required`, labels ni destinos de
 * relación. A cambio, aquí se comprueba que ninguno de los dos lados se mueve
 * sin el otro: si alguien añade un campo al config y no al schema (o al revés),
 * este test falla y dice exactamente qué campo falta y dónde.
 */

/** Claves que Payload rellena solo en una colección de uploads. */
const UPLOAD_AUTO_FIELDS = ['id', 'filename', 'mimeType', 'filesize', 'width', 'height', 'sizes'];

describe('paridad entre los configs de Payload y los schemas Zod', () => {
  it('media coincide con mediaSchema', () => {
    const result = compareFieldParity({
      schemaKeys: Object.keys(mediaSchema.shape),
      fields: Media.fields as ParityField[],
      autoFields: UPLOAD_AUTO_FIELDS,
    });

    expect(result.missingInConfig, 'campos del schema que faltan en el config').toEqual([]);
    expect(result.missingInSchema, 'campos del config que faltan en el schema').toEqual([]);
  });
  it('categories coincide con categorySchema', () => {
    const result = compareFieldParity({
      schemaKeys: Object.keys(categorySchema.shape),
      fields: Categories.fields as ParityField[],
      autoFields: ['id'],
    });

    expect(result.missingInConfig, 'campos del schema que faltan en el config').toEqual([]);
    expect(result.missingInSchema, 'campos del config que faltan en el schema').toEqual([]);
  });

  it('articles coincide con articleSchema', () => {
    const result = compareFieldParity({
      schemaKeys: Object.keys(articleSchema.shape),
      fields: Articles.fields as ParityField[],
      autoFields: ['id'],
    });

    expect(result.missingInConfig, 'campos del schema que faltan en el config').toEqual([]);
    expect(result.missingInSchema, 'campos del config que faltan en el schema').toEqual([]);
  });
});
