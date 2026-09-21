import { Eyebrow } from '../../primitives/Eyebrow';
import { Image } from '../../primitives/Image';

import type { HeroVariantProps } from './hero.types';

/**
 * Dimensiones intrínsecas del logo, para que `next/image` reserve el hueco y
 * la página no salte al cargar. Son las del asset del cliente de referencia
 * (1520×637), reducidas; el ancho real lo fijan las clases responsive.
 */
const LOGO_ANCHO = 500;
const LOGO_ALTO = 210;

/**
 * Las tres piezas de texto del hero: supertítulo, titular y subtítulo.
 *
 * Compartidas por las dos variantes —lo que cambia es el fondo sobre el que
 * van, no el contenido—. El supertítulo usa la primitiva `Eyebrow` en su tamaño
 * mayor, el único sitio del diseño con ese espaciado entre letras.
 *
 * **La página siempre tiene un `<h1>`.** Cuando el titular es el logo, como en
 * la home del export, el `<h1>` se pinta igual pero oculto, con el nombre del
 * site. El diseño original deja esa página sin encabezado legible, y eso es un
 * fallo de accesibilidad y SEO que no se copia (DEC-002).
 */
export function HeroTitle({ data, logoUrl, siteName }: HeroVariantProps) {
  const { eyebrow, title, subtitle, titleMode } = data;
  const conLogo = titleMode === 'logo' && logoUrl !== undefined;

  // El nombre del site si lo hay, y si no el título del hero: el mismo texto
  // sirve de encabezado oculto y de `alt` del logo, y dejarlos calcularse por
  // separado ya hizo que uno cayera al título y el otro a cadena vacía.
  const rotulo = siteName ?? title ?? '';

  return (
    <>
      {eyebrow ? (
        <Eyebrow size="lg" className="mb-6 md:mb-8">
          {eyebrow}
        </Eyebrow>
      ) : null}

      {conLogo ? (
        <>
          <h1 className="sr-only">{rotulo}</h1>
          <Image
            src={logoUrl}
            alt={rotulo}
            width={LOGO_ANCHO}
            height={LOGO_ALTO}
            className="mb-8 h-auto w-[240px] object-contain drop-shadow-2xl sm:w-[360px] md:w-[500px]"
          />
        </>
      ) : (
        <h1 className="text-primary-foreground mb-5 leading-[1.05]">{title}</h1>
      )}

      {subtitle ? (
        <p className="text-primary-foreground/80 font-body text-lg tracking-[-0.3px]">{subtitle}</p>
      ) : null}
    </>
  );
}
