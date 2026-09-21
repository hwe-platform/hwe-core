import type { z } from 'zod';
import type { heroSchema } from './hero.schema';

/** Datos del hero, derivados del schema Zod (DEC-004). */
export type HeroData = z.infer<typeof heroSchema>;

/** Un nivel del rastro de migas que el hero pinta sobre la imagen. */
export type Breadcrumb = { label: string; url?: string };

/** Rótulos de interfaz que el hero pinta por su cuenta. No salen de Payload. */
export type HeroLabels = {
  /** `aria-label` del rastro de migas. */
  breadcrumbs: string;
};

/** Props comunes a todas las variantes del hero. */
export type HeroVariantProps = {
  data: HeroData;
  labels: HeroLabels;
  /** Ruta hasta la página actual. Solo se pinta si `showBreadcrumbs`. */
  breadcrumbs?: Breadcrumb[];
  /** Logo del site, para `titleMode: 'logo'`. */
  logoUrl?: string;
  /** Nombre del site: alternativo del logo y `<h1>` accesible cuando hay logo. */
  siteName?: string;
};
