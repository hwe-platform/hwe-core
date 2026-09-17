import { Image } from '../primitives/Image';
import { Link } from '../primitives/Link';
import { RichText } from '../primitives/RichText';
import { mediaUrl } from '../lib/media';

import type { FooterData } from '../schemas/globals/footer.types';
import type { SiteConfigData } from '../schemas/globals/site-config.types';

/** Redes sociales de `site-config`, en el orden en que se pintan. */
const REDES = ['instagram', 'facebook', 'youtube', 'linkedin', 'tiktok'] as const;

/** Props de {@link Footer}. */
export type FooterProps = {
  /** Global `footer` de Payload. */
  data: FooterData;
  /** Global `site-config`: de aquí salen redes, pagos y enlaces legales. */
  config: SiteConfigData;
};

/** Una columna del pie. Su `type` decide qué contenido se pinta. */
function Columna({ columna }: { columna: FooterData['columns'][number] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wide">{columna.title}</h3>

      {columna.type === 'links' && columna.links ? (
        <ul className="flex flex-col gap-2">
          {columna.links.map((link) => (
            <li key={`${link.url}-${link.label}`}>
              <Link href={link.url} className="text-sm hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {columna.type === 'text' && columna.content ? <RichText content={columna.content} /> : null}

      {columna.type === 'newsletter' && columna.newsletter ? (
        <div className="flex flex-col gap-3 text-sm">
          {columna.newsletter.description ? <p>{columna.newsletter.description}</p> : null}
          <Link
            href={columna.newsletter.actionUrl}
            className="border-primary-foreground/40 inline-flex w-fit rounded-2xl border px-4 py-2 font-medium"
          >
            {columna.newsletter.buttonLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Pie del site.
 *
 * Las redes sociales, los métodos de pago y los enlaces legales **no están en
 * el global `footer`**: se leen de `site-config`, que es su fuente única. Así
 * cambiar un perfil de Instagram se hace en un sitio, no en dos
 * (specs/payload/modelo-datos.md).
 *
 * @example
 * <Footer data={footer} config={siteConfig} />
 */
export function Footer({ data, config }: FooterProps) {
  return (
    <footer className="bg-footer mt-auto text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
        {data.virtualAssistant.enabled ? (
          <section className="border-b border-white/20 pb-10">
            {data.virtualAssistant.title ? (
              <h2 className="font-heading text-xl font-bold">{data.virtualAssistant.title}</h2>
            ) : null}
            {data.virtualAssistant.subtitle ? (
              <p className="mt-2 text-sm text-white/70">{data.virtualAssistant.subtitle}</p>
            ) : null}
          </section>
        ) : null}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {data.columns.map((columna) => (
            <Columna key={columna.title} columna={columna} />
          ))}
        </div>

        {data.partners.length > 0 ? (
          <section className="flex flex-col gap-4 border-t border-white/20 pt-8">
            <h3 className="text-sm font-bold uppercase tracking-wide">Nuestros partners</h3>
            <ul className="flex flex-wrap items-center gap-6">
              {data.partners.map((partner) => (
                <li key={partner.name}>
                  {partner.url ? (
                    <Link href={partner.url}>
                      <PartnerLogo partner={partner} />
                    </Link>
                  ) : (
                    <PartnerLogo partner={partner} />
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <BandaSocial config={config} />
        <BandaLegal config={config} copyright={data.copyright} />
      </div>
    </footer>
  );
}

/** Redes sociales y métodos de pago. Ambos salen de `site-config`. */
function BandaSocial({ config }: { config: SiteConfigData }) {
  const redes = REDES.map((red) => ({ red, url: config.social[red] })).filter(
    (entrada): entrada is { red: (typeof REDES)[number]; url: string } => Boolean(entrada.url),
  );

  if (redes.length === 0 && config.payments.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:justify-between">
      {redes.length > 0 ? (
        <ul className="flex flex-wrap gap-4 text-sm">
          {redes.map(({ red, url }) => (
            <li key={red}>
              <Link href={url} className="capitalize hover:underline">
                {red}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {config.payments.length > 0 ? (
        <p className="text-sm text-white/70">{config.payments.join(' · ')}</p>
      ) : null}
    </div>
  );
}

/** Enlaces legales y aviso de copyright. */
function BandaLegal({ config, copyright }: { config: SiteConfigData; copyright: string }) {
  return (
    <div className="flex flex-col gap-4 text-sm text-white/70 sm:flex-row sm:justify-between">
      <ul className="flex flex-wrap gap-4">
        {config.legal.links.map((link) => (
          <li key={`${link.url}-${link.label}`}>
            <Link href={link.url} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p>{copyright}</p>
    </div>
  );
}

/** Logo de un partner, con o sin enlace. */
function PartnerLogo({ partner }: { partner: FooterData['partners'][number] }) {
  const url = mediaUrl(partner.logo);
  return url ? (
    <Image src={url} alt={partner.name} width={120} height={48} />
  ) : (
    <span className="text-sm">{partner.name}</span>
  );
}
