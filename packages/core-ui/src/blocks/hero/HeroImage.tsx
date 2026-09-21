import { HeroBreadcrumbs } from './HeroBreadcrumbs';
import { HeroTitle } from './HeroTitle';
import { Image } from '../../primitives/Image';
import { mediaUrl, mediaAlt } from '../../lib/media';
import { cn } from '../../lib/cn';

import type { HeroVariantProps } from './hero.types';

/**
 * Hero de página interior: imagen de fondo con degradado y migas de pan.
 *
 * El degradado es del **color de marca**, no negro: el diseño tiñe la foto de
 * verde en lugar de oscurecerla, y copiarlo en negro cambia por completo el
 * carácter de la cabecera. La imagen va atenuada para que el tinte se imponga.
 *
 * El contenido se ancla abajo (`items-end`), que es lo que deja el titular a la
 * altura de la vista con una altura de cabecera moderada.
 */
export function HeroImage(props: HeroVariantProps) {
  const { data, breadcrumbs = [], labels } = props;
  const src = mediaUrl(data.media, 'hero');

  return (
    <section className="bg-primary relative flex min-h-[440px] items-end overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt={mediaAlt(data.media)}
          fill
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      ) : null}
      <div
        aria-hidden
        className="from-primary/80 via-primary/60 to-primary/80 absolute inset-0 bg-gradient-to-b"
      />

      <div
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-14 pt-24 sm:px-6 lg:px-8',
          data.align === 'center' ? 'items-center text-center' : 'items-start text-left',
        )}
      >
        {data.showBreadcrumbs ? (
          <HeroBreadcrumbs items={breadcrumbs} label={labels.breadcrumbs} />
        ) : null}
        <HeroTitle {...props} />
      </div>
    </section>
  );
}
