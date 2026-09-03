import { describe, it, expect } from 'vitest';
import { mediaSchema, mediaRefSchema } from './media.schema';

const validMedia = {
  id: 'media-1',
  filename: 'hero.jpg',
  alt: 'Vista del camping al atardecer',
  mimeType: 'image/jpeg',
  filesize: 204800,
  width: 1920,
  height: 1080,
  sizes: {
    hero: { url: '/hero-1920.jpg', width: 1920, height: 1080 },
  },
};

describe('mediaSchema', () => {
  it('valida un documento de media completo', () => {
    const result = mediaSchema.safeParse(validMedia);
    expect(result.success).toBe(true);
  });

  it('valida un documento con solo los campos obligatorios', () => {
    const result = mediaSchema.safeParse({
      id: 'media-2',
      filename: 'doc.pdf',
      alt: 'Ficha técnica',
      mimeType: 'application/pdf',
      filesize: 51200,
    });
    expect(result.success).toBe(true);
  });

  it('rechaza un documento sin alt', () => {
    const { id, filename, mimeType, filesize } = validMedia;
    const result = mediaSchema.safeParse({ id, filename, mimeType, filesize });
    expect(result.success).toBe(false);
  });

  it('rechaza filesize con tipo incorrecto', () => {
    const result = mediaSchema.safeParse({ ...validMedia, filesize: '204800' });
    expect(result.success).toBe(false);
  });
});

describe('mediaRefSchema', () => {
  it('acepta un id sin poblar', () => {
    const result = mediaRefSchema.safeParse('media-1');
    expect(result.success).toBe(true);
  });

  it('acepta un documento poblado', () => {
    const result = mediaRefSchema.safeParse(validMedia);
    expect(result.success).toBe(true);
  });

  it('rechaza un número', () => {
    const result = mediaRefSchema.safeParse(123);
    expect(result.success).toBe(false);
  });
});
