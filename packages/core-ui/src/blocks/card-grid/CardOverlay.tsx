import { Image } from '../../primitives/Image';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { mediaAlt, mediaUrl } from '../../lib/media';
import { cn } from '../../lib/cn';

import type { CardProps } from './card-grid.types';

/**
 * Tarjeta con el texto sobre la imagen.
 *
 * Es la de «Nos Hébergements» y «Les Alentours»: la foto ocupa todo el marco,
 * un degradado desde abajo la oscurece lo justo para que el texto se lea, y el
 * contenido se ancla al borde inferior.
 *
 * El alto es fijo y no una proporción porque la imagen aquí es fondo, no
 * contenido: lo que manda es que la fila cuadre, no que la foto se respete.
 */
export function CardOverlay({ item, className }: CardProps) {
  const src = mediaUrl(item.image, 'card');

  return (
    <div
      className={cn(
        'relative h-[320px] overflow-hidden rounded-2xl md:h-[440px] lg:h-[560px]',
        className,
      )}
    >
      {src ? <Image src={src} alt={mediaAlt(item.image)} fill className="object-cover" /> : null}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
      />

      <div className="absolute bottom-0 left-0 p-5 md:p-8 lg:p-10">
        {item.tag ? (
          <p className="text-secondary mb-3 text-xs font-bold uppercase tracking-[2px]">
            {item.tag}
          </p>
        ) : null}

        <h3 className="text-primary-foreground mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
          {item.title}
        </h3>

        {item.subtitle ? (
          <p className="text-primary-foreground/80 mb-6 text-xl font-medium">{item.subtitle}</p>
        ) : null}

        {item.url && item.readMoreLabel ? (
          // El enlace suelto va en claro porque aquí el fondo es la foto; el
          // botón relleno ya trae su propio color de la variante.
          <Button
            href={item.url}
            variant={item.variant}
            className={item.variant === 'link' ? 'text-primary-foreground' : undefined}
          >
            {item.readMoreLabel}
            <Icon name="arrowRight" size="sm" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
