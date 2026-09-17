'use client';

import { useState } from 'react';

import { Banner } from './Banner';
import { BottomBookingWidget } from './BottomBookingWidget';
import { FloatingActions } from './FloatingActions';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { SecondaryNav } from './SecondaryNav';
import { TopBar } from './TopBar';
import { mediaUrl } from '../lib/media';

import type { ReactNode } from 'react';
import type { BannerData } from '../schemas/globals/banner.types';
import type { FooterData } from '../schemas/globals/footer.types';
import type { HeaderData } from '../schemas/globals/header.types';
import type { SiteConfigData } from '../schemas/globals/site-config.types';

/** Los cuatro globals que alimentan el marco de un site. */
export type SiteGlobals = {
  siteConfig: SiteConfigData;
  header: HeaderData;
  footer: FooterData;
  banner?: BannerData;
};

/** Props de {@link SiteLayout}. */
export type SiteLayoutProps = {
  globals: SiteGlobals;
  /** Idioma activo, para el selector de la barra superior. */
  locale?: string;
  children: ReactNode;
};

/**
 * Marco compartido por todas las páginas del site.
 *
 * **Es una conveniencia, no una obligación.** Cada pieza se exporta por
 * separado, así que un cliente cuyo diseño se aparte de esta composición
 * escribe su propio layout importando las que le sirvan, en lugar de pelearse
 * con props de sustitución. El layout se monta una vez por site y no cambia:
 * no necesita la indirección de un registry como los bloques, donde el editor
 * inserta dinámicamente y el código no sabe qué vendrá.
 *
 * Es el propietario del `<main>`: una página que use `SiteLayout` no debe
 * añadir el suyo.
 *
 * @example
 * <SiteLayout globals={globals} locale="fr">{children}</SiteLayout>
 */
export function SiteLayout({ globals, locale, children }: SiteLayoutProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { siteConfig, header, footer, banner } = globals;

  const logo = mediaUrl(siteConfig.general.logo);

  return (
    <div className="flex min-h-screen flex-col">
      {banner ? <Banner data={banner} /> : null}

      <TopBar
        data={header}
        locales={{ available: siteConfig.languages.available, current: locale ?? '' }}
        onOpenMenu={() => setMenuAbierto(true)}
      />
      {/* Compensa la altura de la barra fija, para que el contenido no salte. */}
      <div className="h-12 md:h-10" />

      <SecondaryNav data={header} logoUrl={logo} siteName={siteConfig.general.siteName} />

      <MobileMenu data={header} open={menuAbierto} onClose={() => setMenuAbierto(false)} />

      <main className="flex-1">{children}</main>

      <Footer data={footer} config={siteConfig} />

      <BottomBookingWidget
        openLabel={header.topBar.bookingButtonLabel}
        closeLabel="Cerrar"
        searchLabel={header.topBar.bookingButtonLabel}
      />

      <FloatingActions />
    </div>
  );
}
