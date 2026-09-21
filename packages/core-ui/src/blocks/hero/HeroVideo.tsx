import { HeroTitle } from './HeroTitle';
import { mediaUrl } from '../../lib/media';
import { cn } from '../../lib/cn';

import type { HeroVariantProps } from './hero.types';

/**
 * Hero a pantalla completa con vídeo de fondo.
 *
 * Lleva **dos capas** sobre el vídeo, como el export: un velo plano que baja el
 * contraste general y un degradado vertical que oscurece arriba y abajo para
 * que el texto se lea sobre cualquier fotograma.
 *
 * El vídeo va `muted` de forma obligatoria: sin eso los navegadores bloquean la
 * reproducción automática y queda un rectángulo negro.
 */
export function HeroVideo(props: HeroVariantProps) {
  const { data } = props;
  const src = mediaUrl(data.media);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} />
        </video>
      ) : null}

      <div aria-hidden className="absolute inset-0 bg-black/35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"
      />

      <div
        className={cn(
          'relative z-10 flex w-full max-w-[920px] flex-col px-6',
          data.align === 'center' ? 'items-center text-center' : 'items-start text-left',
        )}
      >
        <HeroTitle {...props} />
      </div>
    </section>
  );
}
