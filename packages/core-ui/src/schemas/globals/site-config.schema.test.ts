import { describe, it, expect } from 'vitest';
import { siteConfigSchema } from './site-config.schema';

function minimalSiteConfig(overrides: Record<string, unknown> = {}) {
  return {
    general: {
      siteName: 'Camping La Civelle',
      siteDescription: 'Camping familial au cœur des Landes',
      logo: 'media-1',
      logoInverted: 'media-2',
      openingDates: '1er avril au 30 septembre',
    },
    contact: {
      address: '123 route de la plage',
      postalCode: '40140',
      city: 'Magescq',
      country: 'France',
      phone: '+33500000000',
      email: 'contact@lacivelle.fr',
    },
    location: {
      latitude: 43.9,
      longitude: -1.2,
      transport: [],
    },
    languages: {
      available: ['fr', 'en'],
      default: 'fr',
      prefixDefault: false,
      strategy: 'prefix',
    },
    social: {},
    payments: ['CB', 'Visa'],
    legal: { links: [] },
    tracking: {},
    customCode: [],
    booking: { engine: 'thr' },
    ...overrides,
  };
}

describe('siteConfigSchema', () => {
  it('valida una configuración mínima válida', () => {
    const result = siteConfigSchema.safeParse(minimalSiteConfig());
    expect(result.success).toBe(true);
  });

  it('rechaza languages.strategy fuera del enum', () => {
    const result = siteConfigSchema.safeParse(
      minimalSiteConfig({
        languages: {
          available: ['fr'],
          default: 'fr',
          prefixDefault: false,
          strategy: 'subdomain',
        },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('rechaza booking.engine fuera del enum', () => {
    const result = siteConfigSchema.safeParse(
      minimalSiteConfig({ booking: { engine: 'otro-motor' } }),
    );
    expect(result.success).toBe(false);
  });

  it('rechaza location.transport con un icon fuera del enum', () => {
    const result = siteConfigSchema.safeParse(
      minimalSiteConfig({
        location: {
          latitude: 43.9,
          longitude: -1.2,
          transport: [{ icon: 'bicicleta', label: 'En vélo' }],
        },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('aplica requiresConsent = false por defecto en customCode', () => {
    const result = siteConfigSchema.parse(
      minimalSiteConfig({
        customCode: [{ label: 'Cookiebot', code: '<script></script>', position: 'head' }],
      }),
    );
    expect(result.customCode[0]?.requiresConsent).toBe(false);
  });
});
