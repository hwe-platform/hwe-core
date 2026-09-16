import { describe, it, expect } from 'vitest';
import { topLevelFieldNames, compareFieldParity } from './field-parity';

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
