import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateInput, PayloadValidationError } from './validate-input';

const schema = z.object({
  name: z.string(),
  specs: z.object({ capacity: z.number() }),
});

describe('validateInput', () => {
  it('devuelve los datos parseados cuando son válidos', () => {
    const data = validateInput(
      schema,
      { name: 'Cottage', specs: { capacity: 4 } },
      'accommodations',
    );
    expect(data).toEqual({ name: 'Cottage', specs: { capacity: 4 } });
  });

  it('descarta las claves que Payload añade y el schema no declara', () => {
    const data = validateInput(
      schema,
      { name: 'Cottage', specs: { capacity: 4 }, createdAt: '2026-01-01' },
      'accommodations',
    );
    expect(data).not.toHaveProperty('createdAt');
  });

  it('lanza PayloadValidationError si los datos no cuadran', () => {
    expect(() => validateInput(schema, { name: 'Cottage' }, 'accommodations')).toThrow(
      PayloadValidationError,
    );
  });

  it('nombra el campo que falla, con la ruta anidada', () => {
    try {
      validateInput(schema, { name: 'Cottage', specs: { capacity: 'seis' } }, 'accommodations');
      expect.unreachable('debería haber lanzado');
    } catch (error) {
      expect(error).toBeInstanceOf(PayloadValidationError);
      expect((error as PayloadValidationError).fields).toEqual(['specs.capacity']);
      expect((error as PayloadValidationError).message).toContain('accommodations');
      expect((error as PayloadValidationError).message).toContain('specs.capacity');
    }
  });

  it('acumula todos los campos inválidos, no solo el primero', () => {
    try {
      validateInput(schema, { specs: { capacity: 'seis' } }, 'accommodations');
      expect.unreachable('debería haber lanzado');
    } catch (error) {
      expect((error as PayloadValidationError).fields).toEqual(['name', 'specs.capacity']);
    }
  });

  it('marca la raíz cuando el fallo no es de un campo concreto', () => {
    try {
      validateInput(schema, 'no soy un objeto', 'accommodations');
      expect.unreachable('debería haber lanzado');
    } catch (error) {
      expect((error as PayloadValidationError).fields).toEqual(['(raíz)']);
    }
  });
});
