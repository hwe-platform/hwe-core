import NextImage from 'next/image';

import { cn } from '../lib/cn';

import type { ImageProps as NextImageProps } from 'next/image';

/** Relaciones de aspecto soportadas por el contenedor de la imagen. */
export type AspectRatio = '16/9' | '4/3' | '1/1' | '3/4';

/**
 * Tamaños de imagen que genera Payload para la collection `media`
 * (ver specs/payload/modelo-datos.md).
 */
export type MediaSize = 'thumbnail' | 'card' | 'hero';

/** Ancho en píxeles de cada tamaño generado por Payload. */
const MEDIA_SIZE_WIDTHS: Record<MediaSize, number> = {
  thumbnail: 400,
  card: 800,
  hero: 1920,
};

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
};

export type ImageProps = Omit<NextImageProps, 'alt' | 'sizes'> & {
  /** Texto alternativo. Obligatorio — una imagen sin `alt` no es accesible. */
  alt: string;
  /** Relación de aspecto del contenedor. Si se omite, se usa el `width`/`height` nativos. */
  aspectRatio?: AspectRatio;
  /** Tamaño de referencia (de los que genera Payload) para calcular el atributo `sizes`. */
  mediaSize?: MediaSize;
  /** Activa el placeholder de desenfoque mientras carga (requiere `blurDataURL`). */
  showBlurPlaceholder?: boolean;
  /**
   * La imagen llena su contenedor posicionado, sin declarar dimensiones.
   *
   * Es el caso de las imágenes de fondo a sangre —la cabecera de una página, una
   * tarjeta con la foto detrás—, donde el alto lo pone el contenedor y no la
   * imagen. Quien la use es responsable de que el padre tenga `position`, que es
   * lo que exige `next/image`, y de darle `object-cover` por `className`.
   *
   * Incompatible con `aspectRatio`, que ya crea su propio contenedor.
   */
  fill?: boolean;
};

/**
 * Wrapper de `next/image` con `alt` obligatorio, aspect ratios predefinidos
 * y `sizes` calculado a partir de los tamaños que genera la collection
 * `media` de Payload.
 *
 * @example
 * <Image src={photo.url} alt="Mobile home vista exterior" aspectRatio="4/3" mediaSize="card" />
 */
export function Image({
  alt,
  aspectRatio,
  mediaSize = 'card',
  showBlurPlaceholder = false,
  fill = false,
  className,
  blurDataURL,
  ...props
}: ImageProps) {
  // A sangre la imagen puede ocupar todo el ancho de la ventana, así que pedir
  // el tamaño de referencia serviría una imagen corta en pantallas grandes.
  const sizes = fill ? '100vw' : `(max-width: 768px) 100vw, ${MEDIA_SIZE_WIDTHS[mediaSize]}px`;
  const useBlur = showBlurPlaceholder && Boolean(blurDataURL);
  const blurProps = useBlur ? { placeholder: 'blur' as const, blurDataURL } : {};

  if (aspectRatio) {
    return (
      <div className={cn('relative overflow-hidden', ASPECT_RATIO_CLASSES[aspectRatio], className)}>
        <NextImage
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          {...blurProps}
          {...props}
        />
      </div>
    );
  }

  if (fill) {
    return (
      <NextImage alt={alt} fill sizes={sizes} className={className} {...blurProps} {...props} />
    );
  }

  return <NextImage alt={alt} sizes={sizes} className={className} {...blurProps} {...props} />;
}
