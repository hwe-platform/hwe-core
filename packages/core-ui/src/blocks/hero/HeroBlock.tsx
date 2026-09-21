import { heroSchema } from './hero.schema';
import { normalizePayloadData } from '../../payload/normalize-payload-data';
import { HeroImage } from './HeroImage';
import { HeroMinimal } from './HeroMinimal';
import { HeroVideo } from './HeroVideo';

import type { ComponentType } from 'react';
import type { Breadcrumb, HeroLabels, HeroVariantProps } from './hero.types';

/**
 * Variante → componente.
 *
 * Es un **mapa, no un `switch`**: cada variante cambia la anatomía del HTML
 * —un `<video>` de fondo no es una `<img>` con degradado—, así que son
 * componentes separados. Añadir una variante es añadir una entrada aquí, sin
 * tocar la lógica (`docs/arquitectura/bloques.md`).
 *
 * `none` no tiene componente a propósito: significa "esta página no lleva
 * cabecera", y su ausencia del mapa es lo que la hace no pintar nada.
 */
const VARIANTES: Record<string, ComponentType<HeroVariantProps>> = {
  video: HeroVideo,
  image: HeroImage,
  minimal: HeroMinimal,
};

/** Props de {@link HeroBlock}. */
export type HeroProps = {
  /** Grupo `hero` de la página, sin validar. */
  data: unknown;
  breadcrumbs?: Breadcrumb[];
  logoUrl?: string;
  siteName?: string;
  /** Rótulos de interfaz. Por defecto, en francés. */
  labels?: Partial<HeroLabels>;
};

/** Rótulos por defecto, en el idioma del primer site. */
const ROTULOS: HeroLabels = {
  breadcrumbs: "Fil d'Ariane",
};

/**
 * Cabecera de una página.
 *
 * **No es un bloque del page builder**: es un grupo de campos de `pages`, así
 * que no se registra en el registry y lo invoca la plantilla de página, una
 * sola vez, antes de los bloques.
 *
 * Valida sus datos y no pinta nada si no cuadran, igual que los bloques: una
 * cabecera mal configurada no debe tumbar la página entera.
 *
 * @example
 * <HeroBlock data={page.hero} breadcrumbs={migas} logoUrl={logo} siteName="Camping La Civelle" />
 */
export function HeroBlock({ data, labels, ...resto }: HeroProps) {
  // Payload representa "vacío" con null y Zod con undefined: sin esto, una
  // imagen con `caption: null` tumba la validación y la cabecera no se pinta.
  const resultado = heroSchema.safeParse(normalizePayloadData(data));

  if (!resultado.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console -- aviso de desarrollo, fuera del bundle de producción
      console.warn('Hero: datos inválidos', resultado.error.issues);
    }
    return null;
  }

  const Variante = VARIANTES[resultado.data.variant];
  if (!Variante) return null;

  return <Variante data={resultado.data} labels={{ ...ROTULOS, ...labels }} {...resto} />;
}
