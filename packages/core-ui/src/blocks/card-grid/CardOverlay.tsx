import { Image } from '../../primitives/Image';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { mediaAlt, mediaUrl } from '../../lib/media';
import { esVarianteDeEnlace } from '../seccion';
import { cn } from '../../lib/cn';

import type { CardProps } from './card-grid.types';

/**
 * Las dos escalas de la tarjeta, sacadas de las dos secciones del diseño.
 *
 * Tabla y no cálculo: son dos juegos de valores medidos, no una progresión.
 * Cuál se usa lo dice el bloque —es un eje— y no el número de columnas: el
 * diseño de referencia pone la grande donde hay dos tarjetas y la pequeña
 * donde hay cuatro, pero esa correlación es suya y no del sistema.
 */
const ESCALAS = {
  default: {
    // «Nos Hébergements» — App.tsx:678-688
    marco: 'h-[360px] md:h-[500px] lg:h-[620px]',
    relleno: 'p-6 md:p-10 lg:p-12',
    titular: 'mb-3 text-3xl md:mb-4 md:text-4xl lg:text-5xl',
    velo: 'via-black/20',
    enlace: undefined,
  },
  compact: {
    // «Les Alentours» — App.tsx:960-972
    marco: 'h-[320px] md:h-[420px] lg:h-[540px]',
    relleno: 'p-5 md:p-8 lg:p-10',
    titular: 'mb-4 text-2xl md:mb-6 md:text-3xl lg:text-4xl',
    velo: 'via-black/10',
    enlace: 'text-sm',
  },
};

/**
 * Tarjeta con el texto sobre la imagen.
 *
 * Es la de «Nos Hébergements» y «Les Alentours»: la foto ocupa todo el marco,
 * un degradado desde abajo la oscurece lo justo para que el texto se lea, y el
 * contenido se ancla al borde inferior. Las dos secciones usan escalas
 * distintas, y de ahí el eje `size`.
 *
 * El alto es fijo y no una proporción porque la imagen aquí es fondo, no
 * contenido: lo que manda es que la fila cuadre, no que la foto se respete.
 */
export function CardOverlay({ item, className, size = 'default' }: CardProps) {
  const src = mediaUrl(item.image, 'card');
  const escala = ESCALAS[size as keyof typeof ESCALAS] ?? ESCALAS.default;

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', escala.marco, className)}>
      {src ? <Image src={src} alt={mediaAlt(item.image)} fill className="object-cover" /> : null}

      <div
        aria-hidden
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/90 to-transparent',
          escala.velo,
        )}
      />

      <div className={cn('absolute bottom-0 left-0', escala.relleno)}>
        {item.tag ? (
          <p className="text-secondary mb-3 text-xs font-bold uppercase tracking-[2px]">
            {item.tag}
          </p>
        ) : null}

        <h3 className={cn('text-primary-foreground font-bold', escala.titular)}>{item.title}</h3>

        {item.subtitle ? (
          <p className="text-primary-foreground/80 mb-10 text-xl font-medium">{item.subtitle}</p>
        ) : null}

        {item.url && item.readMoreLabel ? (
          // El enlace suelto va en claro porque aquí el fondo es la foto; el
          // botón relleno ya trae su propio color y su propia talla de los
          // tokens del cliente, y meterle la de la escala haría convivir dos
          // cuerpos en el mismo elemento — la trampa que ya costó una vuelta.
          <Button
            href={item.url}
            variant={item.variant}
            className={
              esVarianteDeEnlace(item.variant)
                ? cn('text-primary-foreground', escala.enlace)
                : undefined
            }
          >
            {item.readMoreLabel}
            <Icon name="arrowRight" size="sm" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
