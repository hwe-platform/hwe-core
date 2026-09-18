'use client';

import { useState } from 'react';
import { cva } from 'class-variance-authority';

import { Icon } from '../primitives/Icon';
import { Link } from '../primitives/Link';
import { cn } from '../lib/cn';

import type { BannerData } from '../schemas/globals/banner.types';

const bannerVariants = cva('w-full px-4 py-3 text-sm sm:px-6 lg:px-8', {
  variants: {
    type: {
      info: 'bg-accent text-accent-foreground',
      warning: 'bg-secondary text-secondary-foreground',
      promo: 'bg-primary text-primary-foreground',
    },
  },
  defaultVariants: { type: 'info' },
});

/** Props de {@link Banner}. */
export type BannerProps = {
  /** Global `banner` de Payload. */
  data: BannerData;
};

/**
 * Aviso global sobre el resto del site.
 *
 * Es cliente porque puede cerrarse. El cierre no se recuerda entre páginas a
 * propósito: un aviso relevante —un cambio de horario, una incidencia— debe
 * volver a verse, y recordarlo exigiría almacenamiento en el navegador que el
 * visitante no ha consentido.
 *
 * @example
 * <Banner data={banner} />
 */
export function Banner({ data }: BannerProps) {
  const [cerrado, setCerrado] = useState(false);

  if (!data.enabled || cerrado) return null;

  const mensaje = data.url ? <Link href={data.url}>{data.message}</Link> : data.message;

  return (
    <div className={cn(bannerVariants({ type: data.type }))} role="status">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <p className="font-body">{mensaje}</p>

        {data.dismissible ? (
          <button
            type="button"
            onClick={() => setCerrado(true)}
            aria-label="Cerrar el aviso"
            className="shrink-0 rounded-lg p-1 transition-opacity hover:opacity-70"
          >
            <Icon name="x" size="sm" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
