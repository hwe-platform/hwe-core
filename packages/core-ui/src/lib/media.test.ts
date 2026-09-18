import { describe, it, expect } from 'vitest';
import { mediaUrl, mediaAlt, isPopulatedMedia } from './media';

import type { MediaData } from '../schemas/collections/media.types';

const foto: MediaData = {
  id: 1,
  filename: 'hero.jpg',
  url: '/media/hero.jpg',
  alt: 'Vue extérieure du camping',
  mimeType: 'image/jpeg',
  filesize: 22769,
  width: 2400,
  height: 1600,
  sizes: {
    card: { url: '/media/hero-800x533.jpg', width: 800, height: 533 },
    hero: { url: '/media/hero-1920x1280.jpg', width: 1920, height: 1280 },
  },
};

describe('isPopulatedMedia', () => {
  it('distingue el documento poblado del id suelto', () => {
    expect(isPopulatedMedia(foto)).toBe(true);
    expect(isPopulatedMedia(1)).toBe(false);
    expect(isPopulatedMedia('media-1')).toBe(false);
  });

  it('trata null y undefined como no poblados', () => {
    expect(isPopulatedMedia(null)).toBe(false);
    expect(isPopulatedMedia(undefined)).toBe(false);
  });
});

describe('mediaUrl', () => {
  it('devuelve la url original si no se pide tamaño', () => {
    expect(mediaUrl(foto)).toBe('/media/hero.jpg');
  });

  it('devuelve la variante pedida', () => {
    expect(mediaUrl(foto, 'card')).toBe('/media/hero-800x533.jpg');
    expect(mediaUrl(foto, 'hero')).toBe('/media/hero-1920x1280.jpg');
  });

  it('cae a la original si Payload no generó esa variante', () => {
    // thumbnail no existe: una imagen menor que el destino no genera variante
    expect(mediaUrl(foto, 'thumbnail')).toBe('/media/hero.jpg');
  });

  it('devuelve undefined si la referencia no viene poblada', () => {
    expect(mediaUrl(1)).toBeUndefined();
    expect(mediaUrl(null)).toBeUndefined();
    expect(mediaUrl(undefined, 'card')).toBeUndefined();
  });

  it('devuelve undefined si el documento no trae url', () => {
    const { url: _url, ...sinUrl } = foto;
    expect(mediaUrl(sinUrl as MediaData)).toBeUndefined();
  });

  it('cae a la original cuando no hay bloque de tamaños', () => {
    const { sizes: _sizes, ...sinTamanos } = foto;
    expect(mediaUrl(sinTamanos as MediaData, 'card')).toBe('/media/hero.jpg');
  });
});

describe('mediaAlt', () => {
  it('devuelve el texto alternativo del documento', () => {
    expect(mediaAlt(foto)).toBe('Vue extérieure du camping');
  });

  it('devuelve cadena vacía si no viene poblado — es el valor correcto para decorativa', () => {
    expect(mediaAlt(1)).toBe('');
    expect(mediaAlt(null)).toBe('');
  });
});
