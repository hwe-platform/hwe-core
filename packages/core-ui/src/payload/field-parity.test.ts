import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { topLevelFieldNames, compareFieldParity, compareOptionParity } from './field-parity';

describe('topLevelFieldNames', () => {
  it('recoge los campos con nombre', () => {
    expect(topLevelFieldNames([{ name: 'title' }, { name: 'slug' }])).toEqual(['title', 'slug']);
  });

  it('aplana las rows, que no añaden clave al documento', () => {
    expect(topLevelFieldNames([{ fields: [{ name: 'lat' }, { name: 'lng' }] }])).toEqual([
      'lat',
      'lng',
    ]);
  });

  it('cuenta el group por su nombre y no baja a sus hijos', () => {
    expect(topLevelFieldNames([{ name: 'specs', fields: [{ name: 'capacity' }] }])).toEqual([
      'specs',
    ]);
  });

  it('entra en las tabs', () => {
    expect(topLevelFieldNames([{ tabs: [{ fields: [{ name: 'seo' }] }] }])).toEqual(['seo']);
  });

  it('ignora los campos de presentación sin nombre ni hijos', () => {
    expect(topLevelFieldNames([{}, { name: 'title' }])).toEqual(['title']);
  });
});

describe('compareFieldParity', () => {
  it('no encuentra diferencias cuando config y schema coinciden', () => {
    const result = compareFieldParity({
      schemaKeys: ['name', 'slug'],
      fields: [{ name: 'name' }, { name: 'slug' }],
    });
    expect(result).toEqual({ missingInConfig: [], missingInSchema: [] });
  });

  it('detecta una clave del schema que el config no declara', () => {
    const result = compareFieldParity({
      schemaKeys: ['name', 'slug'],
      fields: [{ name: 'name' }],
    });
    expect(result.missingInConfig).toEqual(['slug']);
  });

  it('detecta un campo del config que el schema no declara', () => {
    const result = compareFieldParity({
      schemaKeys: ['name'],
      fields: [{ name: 'name' }, { name: 'inventado' }],
    });
    expect(result.missingInSchema).toEqual(['inventado']);
  });

  it('ignora los campos que Payload rellena solo', () => {
    const result = compareFieldParity({
      schemaKeys: ['id', 'filename', 'alt'],
      fields: [{ name: 'alt' }],
      autoFields: ['id', 'filename'],
    });
    expect(result).toEqual({ missingInConfig: [], missingInSchema: [] });
  });
});

describe('compareOptionParity', () => {
  it('no reporta nada cuando las opciones coinciden con el enum', () => {
    const schema = z.object({ icon: z.enum(['help', 'phone']) });
    const fields = [{ name: 'icon', type: 'select', options: ['help', 'phone'] }];

    expect(compareOptionParity({ schema, fields })).toEqual([]);
  });

  it('avisa del valor que el schema acepta y el editor no puede elegir', () => {
    const schema = z.object({ icon: z.enum(['help', 'phone', 'mail']) });
    const fields = [{ name: 'icon', type: 'select', options: ['help', 'phone'] }];

    expect(compareOptionParity({ schema, fields })).toEqual([
      { path: 'icon', missingInConfig: ['mail'], missingInSchema: [] },
    ]);
  });

  it('avisa del valor que el editor puede elegir y el schema rechaza', () => {
    const schema = z.object({ icon: z.enum(['help']) });
    const fields = [{ name: 'icon', type: 'select', options: ['help', 'sms'] }];

    expect(compareOptionParity({ schema, fields })).toEqual([
      { path: 'icon', missingInConfig: [], missingInSchema: ['sms'] },
    ]);
  });

  it('acepta las opciones en forma de objeto, como también admite Payload', () => {
    const schema = z.object({ icon: z.enum(['help']) });
    const fields = [{ name: 'icon', type: 'select', options: [{ value: 'help' }] }];

    expect(compareOptionParity({ schema, fields })).toEqual([]);
  });

  it('ignora los select cuyo campo no es un enum: hay valores que no son un conjunto cerrado', () => {
    const schema = z.object({ tag: z.string() });
    const fields = [{ name: 'tag', type: 'select', options: ['uno', 'dos'] }];

    expect(compareOptionParity({ schema, fields })).toEqual([]);
  });

  it('ignora los campos que el schema no declara, que ya caza compareFieldParity', () => {
    const schema = z.object({});
    const fields = [{ name: 'huerfano', type: 'select', options: ['x'] }];

    expect(compareOptionParity({ schema, fields })).toEqual([]);
  });
});

describe('compareOptionParity — recorrido del árbol', () => {
  // El caso real: el select vivía en un array dentro de un group, y por eso la
  // comparación de primer nivel no lo veía.
  it('baja por groups y arrays, y da la ruta completa', () => {
    const schema = z.object({
      topBar: z.object({
        links: z.array(z.object({ icon: z.enum(['help', 'mail']) })),
      }),
    });
    const fields = [
      {
        name: 'topBar',
        type: 'group',
        fields: [
          {
            name: 'links',
            type: 'array',
            fields: [{ name: 'icon', type: 'select', options: ['help'] }],
          },
        ],
      },
    ];

    expect(compareOptionParity({ schema, fields })).toEqual([
      { path: 'topBar.links.icon', missingInConfig: ['mail'], missingInSchema: [] },
    ]);
  });

  it('atraviesa los envoltorios optional y default', () => {
    const schema = z.object({
      variant: z.enum(['a', 'b']).optional(),
      size: z.enum(['sm']).default('sm'),
    });
    const fields = [
      { name: 'variant', type: 'select', options: ['a'] },
      { name: 'size', type: 'select', options: ['sm'] },
    ];

    expect(compareOptionParity({ schema, fields })).toEqual([
      { path: 'variant', missingInConfig: ['b'], missingInSchema: [] },
    ]);
  });

  it('atraviesa las rows, que agrupan sin añadir nivel', () => {
    const schema = z.object({ variant: z.enum(['a']) });
    const fields = [{ fields: [{ name: 'variant', type: 'select', options: ['b'] }] }];

    expect(compareOptionParity({ schema, fields })).toEqual([
      { path: 'variant', missingInConfig: ['a'], missingInSchema: ['b'] },
    ]);
  });
});
