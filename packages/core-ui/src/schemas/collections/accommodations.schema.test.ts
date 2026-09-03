import { describe, it, expect } from 'vitest';
import { accommodationSchema, accommodationRefSchema } from './accommodations.schema';

function minimalAccommodation(overrides: Record<string, unknown> = {}) {
  return {
    id: 'acc-1',
    name: 'Mobile Home Confort 3 chambres',
    slug: 'mobile-home-confort-3-chambres',
    type: 'mobilhome',
    shortDescription: 'Idéal pour les familles',
    description: { root: {} },
    specs: {
      capacity: 6,
      bedrooms: 3,
      surface: 35,
      hasAC: true,
      petFriendly: false,
    },
    pricing: {},
    media: {
      mainImage: 'media-1',
    },
    category: 'cat-1',
    booking: {},
    ...overrides,
  };
}

describe('accommodationSchema', () => {
  it('valida un alojamiento mínimo válido', () => {
    const result = accommodationSchema.safeParse(minimalAccommodation());
    expect(result.success).toBe(true);
  });

  it('rechaza un type que no está en el enum', () => {
    const result = accommodationSchema.safeParse(minimalAccommodation({ type: 'yourte' }));
    expect(result.success).toBe(false);
  });

  it('rechaza si falta specs.capacity', () => {
    const { specs, ...rest } = minimalAccommodation();
    const { capacity: _capacity, ...specsWithoutCapacity } = specs as Record<string, unknown>;
    const result = accommodationSchema.safeParse({ ...rest, specs: specsWithoutCapacity });
    expect(result.success).toBe(false);
  });

  it('aplica pricing.currency = EUR por defecto', () => {
    const result = accommodationSchema.parse(minimalAccommodation());
    expect(result.pricing.currency).toBe('EUR');
  });

  it('aplica featured = false y booking.bookable = false por defecto', () => {
    const result = accommodationSchema.parse(minimalAccommodation());
    expect(result.featured).toBe(false);
    expect(result.booking.bookable).toBe(false);
  });

  it('acepta comparison como array de ids o referencias superficiales', () => {
    const result = accommodationSchema.safeParse(
      minimalAccommodation({
        comparison: ['acc-2', { id: 'acc-3', name: 'Cottage Nature', slug: 'cottage-nature' }],
      }),
    );
    expect(result.success).toBe(true);
  });

  it('rechaza equipment con included de tipo incorrecto', () => {
    const result = accommodationSchema.safeParse(
      minimalAccommodation({
        equipment: [{ label: 'Wifi', icon: 'wifi', included: 'sí' }],
      }),
    );
    expect(result.success).toBe(false);
  });
});

describe('accommodationRefSchema', () => {
  it('acepta un id sin poblar', () => {
    expect(accommodationRefSchema.safeParse('acc-1').success).toBe(true);
  });

  it('acepta un documento completo poblado', () => {
    expect(accommodationRefSchema.safeParse(minimalAccommodation()).success).toBe(true);
  });
});
