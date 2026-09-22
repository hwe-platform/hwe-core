import { Image } from '../../primitives/Image';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { mediaAlt, mediaUrl } from '../../lib/media';
import { cn } from '../../lib/cn';

import type { CardProps } from './card-grid.types';

/**
 * Tarjeta con la imagen arriba y el texto debajo.
 *
 * Es la de «Actualités», «Découvrez aussi» y «Nos Locations», y la que
 * reutiliza el bloque `blog`: por eso la fecha y el texto del enlace son
 * opcionales —se pintan cuando llegan y se omiten cuando no—, en lugar de
 * hacer una tarjeta aparte para los artículos.
 */
export function CardStacked({ item, className }: CardProps) {
  const src = mediaUrl(item.image, 'card');

  return (
    <div
      className={cn(
        'bg-card border-border overflow-hidden rounded-2xl border shadow-sm',
        className,
      )}
    >
      {src ? (
        <div className="relative h-[280px]">
          <Image src={src} alt={mediaAlt(item.image)} fill className="object-cover" />
        </div>
      ) : null}

      <div className="p-5 md:p-8 lg:p-10">
        {item.tag || item.date ? (
          <div className="mb-6 flex items-center gap-4 md:mb-8 md:gap-6">
            {item.tag ? (
              <span className="bg-secondary/10 text-secondary rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[2px]">
                {item.tag}
              </span>
            ) : null}
            {item.date ? (
              <span className="text-muted-foreground text-xs font-bold tracking-widest">
                {item.date}
              </span>
            ) : null}
          </div>
        ) : null}

        <h3 className="text-foreground mb-8 text-2xl font-bold leading-snug">{item.title}</h3>

        {item.subtitle ? (
          <p className="text-muted-foreground mb-8 leading-relaxed">{item.subtitle}</p>
        ) : null}

        {item.url && item.readMoreLabel ? (
          // Sobre el fondo de la tarjeta el enlace va en acento, que es como
          // lo pinta «Actualités».
          <Button
            href={item.url}
            variant={item.variant}
            className={item.variant === 'link' ? 'text-secondary' : undefined}
          >
            {item.readMoreLabel}
            <Icon name="arrowRight" size="sm" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
