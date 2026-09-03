import { describe, it, expect } from 'vitest';
import { bannerSchema } from './banner.schema';

describe('bannerSchema', () => {
  it('valida un banner mínimo válido', () => {
    const result = bannerSchema.safeParse({ enabled: true, message: 'Ouvert !', type: 'info' });
    expect(result.success).toBe(true);
  });

  it('aplica enabled = false y dismissible = true por defecto', () => {
    const result = bannerSchema.parse({ message: 'Ouvert !', type: 'info' });
    expect(result.enabled).toBe(false);
    expect(result.dismissible).toBe(true);
  });

  it('rechaza type fuera del enum', () => {
    const result = bannerSchema.safeParse({ message: 'Ouvert !', type: 'success' });
    expect(result.success).toBe(false);
  });

  it('rechaza un banner sin message', () => {
    const result = bannerSchema.safeParse({ type: 'info' });
    expect(result.success).toBe(false);
  });

  it('url es opcional', () => {
    const result = bannerSchema.safeParse({ message: 'Ouvert !', type: 'promo', url: undefined });
    expect(result.success).toBe(true);
  });
});
