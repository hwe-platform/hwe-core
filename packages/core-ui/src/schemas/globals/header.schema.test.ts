import { describe, it, expect } from 'vitest';
import { headerSchema } from './header.schema';

function minimalHeader(overrides: Record<string, unknown> = {}) {
  return {
    topBar: {
      links: [{ label: 'Aide', icon: 'help', url: '/aide' }],
      bookingButtonLabel: 'Réserver',
    },
    navigation: [{ label: 'Le Camping', url: '/le-camping' }],
    ...overrides,
  };
}

describe('headerSchema', () => {
  it('valida un header mínimo válido', () => {
    const result = headerSchema.safeParse(minimalHeader());
    expect(result.success).toBe(true);
  });

  it('aplica topBar.showLogin = false por defecto', () => {
    const result = headerSchema.parse(minimalHeader());
    expect(result.topBar.showLogin).toBe(false);
  });

  it('rechaza un link de topBar con icon fuera del enum', () => {
    const result = headerSchema.safeParse(
      minimalHeader({
        topBar: {
          links: [{ label: 'Aide', icon: 'question-mark', url: '/aide' }],
          bookingButtonLabel: 'Réserver',
        },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('valida navigation con children anidados', () => {
    const result = headerSchema.safeParse(
      minimalHeader({
        navigation: [
          {
            label: 'Nos Locations',
            url: '/locations',
            children: [{ label: 'Mobil-homes', url: '/locations/mobil-homes' }],
          },
        ],
      }),
    );
    expect(result.success).toBe(true);
  });

  it('rechaza un header sin bookingButtonLabel', () => {
    const result = headerSchema.safeParse(minimalHeader({ topBar: { links: [] } }));
    expect(result.success).toBe(false);
  });
});
