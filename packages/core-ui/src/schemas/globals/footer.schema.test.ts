import { describe, it, expect } from 'vitest';
import { footerSchema } from './footer.schema';

function minimalFooter(overrides: Record<string, unknown> = {}) {
  return {
    virtualAssistant: {},
    columns: [],
    partners: [],
    copyright: '© Camping La Civelle',
    ...overrides,
  };
}

describe('footerSchema', () => {
  it('valida un footer mínimo válido', () => {
    const result = footerSchema.safeParse(minimalFooter());
    expect(result.success).toBe(true);
  });

  it('aplica virtualAssistant.enabled = false por defecto', () => {
    const result = footerSchema.parse(minimalFooter());
    expect(result.virtualAssistant.enabled).toBe(false);
  });

  it('rechaza más de 4 columnas', () => {
    const column = { title: 'Col', type: 'text' as const };
    const result = footerSchema.safeParse(
      minimalFooter({ columns: [column, column, column, column, column] }),
    );
    expect(result.success).toBe(false);
  });

  it('valida una columna de tipo newsletter', () => {
    const result = footerSchema.safeParse(
      minimalFooter({
        columns: [
          {
            title: 'Newsletter',
            type: 'newsletter',
            newsletter: {
              buttonLabel: "S'inscrire",
              provider: 'mailchimp',
              actionUrl: 'https://mailchimp.com/action',
            },
          },
        ],
      }),
    );
    expect(result.success).toBe(true);
  });

  it('rechaza una columna con type fuera del enum', () => {
    const result = footerSchema.safeParse(
      minimalFooter({ columns: [{ title: 'Col', type: 'video' }] }),
    );
    expect(result.success).toBe(false);
  });

  it('valida un partner con url opcional ausente', () => {
    const result = footerSchema.safeParse(
      minimalFooter({ partners: [{ name: 'Office de tourisme', logo: 'media-1' }] }),
    );
    expect(result.success).toBe(true);
  });
});
