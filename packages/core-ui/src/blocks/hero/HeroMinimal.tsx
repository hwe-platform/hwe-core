import { HeroBreadcrumbs } from './HeroBreadcrumbs';
import { HeroTitle } from './HeroTitle';
import { cn } from '../../lib/cn';

import type { HeroVariantProps } from './hero.types';

/**
 * Cabecera sin imagen, sobre el color de marca.
 *
 * No sale del Figma de La Civelle: existe porque el modelo de datos ya
 * declaraba la variante `minimal`, y una variante declarada que no pinta nada
 * es una página en blanco esperando a que alguien la elija en el panel.
 */
export function HeroMinimal(props: HeroVariantProps) {
  const { data, breadcrumbs = [], labels } = props;

  return (
    <section className="bg-primary">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-14 pt-24 sm:px-6 lg:px-8',
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
