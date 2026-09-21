import type { z } from 'zod';
import type { ReactNode } from 'react';
import type { mediaTextBlockSchema } from './media-text.schema';

/** Datos del bloque, derivados del schema Zod (DEC-004). */
export type MediaTextData = z.infer<typeof mediaTextBlockSchema>;

/**
 * Rótulos de interfaz que el bloque pinta por su cuenta.
 *
 * No son contenido: no salen de Payload. Van como props con valor por defecto
 * en el idioma del cliente, porque escritos a mano acaban en el idioma de la
 * conversación —ya pasó con el pie— y a nadie le chirría hasta que lo ve el
 * cliente.
 */
export type MediaTextLabels = {
  /** Botón de imagen anterior del carrusel. */
  previous: string;
  /** Botón de imagen siguiente del carrusel. */
  next: string;
  /** `title` del marco incrustado cuando el bloque no tiene título. */
  embed: string;
};

/** Props que reciben los componentes de la columna del medio. */
export type MediaSlotProps = { data: MediaTextData; labels: MediaTextLabels };

/**
 * Huecos que el site puede rellenar sin tocar el bloque de plataforma.
 *
 * Solo existen los dos que un diseño real pidió. `aside` sale de que el Figma
 * pone tres cosas distintas en el mismo sitio —horarios del restaurante,
 * mini-tarjetas de la piscina, barra de estadísticas de Le Camping—: el caso de
 * libro para un slot en vez de tres props. `sobreLaImagen` sale del medallón
 * «Depuis 30 Ans», que es de La Civelle y de nadie más.
 */
export type MediaTextSlots = {
  /** Caja bajo el texto. Tres usos distintos en el Figma. */
  aside?: ReactNode;
  /** Adorno flotante sobre la imagen. Se parametriza por dónde va, no por qué es. */
  sobreLaImagen?: ReactNode;
};
