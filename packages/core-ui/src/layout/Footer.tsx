import { Eyebrow } from '../primitives/Eyebrow';
import { Icon } from '../primitives/Icon';
import { Image } from '../primitives/Image';
import { Link } from '../primitives/Link';
import { RichText } from '../primitives/RichText';
import { mediaUrl } from '../lib/media';

import type { FooterData } from '../schemas/globals/footer.types';
import type { SiteConfigData } from '../schemas/globals/site-config.types';

/** Redes sociales de `site-config`, con el icono con que se pintan. */
const REDES = [
  { clave: 'instagram', icono: 'heart' },
  { clave: 'facebook', icono: 'users' },
  { clave: 'youtube', icono: 'video' },
  { clave: 'linkedin', icono: 'user' },
  { clave: 'tiktok', icono: 'star' },
] as const;

/** Clase de los enlaces del pie: crema atenuado que vira al acento. */
const ENLACE = 'text-primary-foreground/70 hover:text-secondary text-sm';

/** Props de {@link Footer}. */
export type FooterProps = {
  /** Global `footer` de Payload. */
  data: FooterData;
  /** Global `site-config`: de aquí salen contacto, redes, pagos y legales. */
  config: SiteConfigData;
};

/**
 * Datos de contacto, que en el diseño abren el pie.
 *
 * Salen de `site-config`, no del global `footer`: son la misma información que
 * usan el bloque de mapa y los metadatos, y duplicarla sería pedirle al editor
 * que la mantenga en dos sitios.
 */
function Contacto({ config }: { config: SiteConfigData }) {
  const { general, contact } = config;
  const estrellas = general.stars ? ` ${'★'.repeat(general.stars)}` : '';

  return (
    <div className="flex flex-col gap-6 lg:col-span-3">
      <div>
        <Eyebrow size="sm" as="h2" className="mb-4">
          Contacto
        </Eyebrow>
        <div className="flex gap-3">
          <Icon name="mapPin" size="sm" className="text-secondary mt-1 shrink-0" />
          <div>
            <p className="font-body text-sm font-medium">
              {general.siteName}
              {estrellas}
            </p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {contact.address}
              <br />
              {contact.postalCode} {contact.city}, {contact.country}
            </p>
          </div>
        </div>
      </div>

      <p className="flex items-center gap-3">
        <Icon name="phone" size="sm" className="text-secondary shrink-0" />
        <span className="text-primary-foreground/70 text-sm">{contact.phone}</span>
      </p>

      <p className="flex items-start gap-3">
        <Icon name="mail" size="sm" className="text-secondary shrink-0" />
        <span className="text-primary-foreground/70 break-all text-sm">{contact.email}</span>
      </p>
    </div>
  );
}

/** Una columna del pie. Su `type` decide qué contenido se pinta. */
function Columna({ columna }: { columna: FooterData['columns'][number] }) {
  const esAncha = columna.type === 'newsletter' || columna.type === 'text';

  return (
    <div className={esAncha ? 'lg:col-span-3' : 'lg:col-span-2'}>
      <Eyebrow size="sm" as="h2" className="mb-4">
        {columna.title}
      </Eyebrow>

      {columna.type === 'links' && columna.links ? (
        <ul className="flex flex-col gap-2.5">
          {columna.links.map((link) => (
            <li key={`${link.url}-${link.label}`}>
              <Link href={link.url} className={ENLACE}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {columna.type === 'text' && columna.content ? (
        <RichText content={columna.content} className="text-primary-foreground/70 text-sm" />
      ) : null}

      {columna.type === 'newsletter' && columna.newsletter ? (
        <div className="flex flex-col gap-3">
          {columna.newsletter.description ? (
            <p className="text-primary-foreground/70 text-sm">{columna.newsletter.description}</p>
          ) : null}
          <Link
            href={columna.newsletter.actionUrl}
            className="bg-secondary text-primary-foreground inline-flex w-full justify-center rounded-2xl px-4 py-2 text-sm font-semibold"
          >
            {columna.newsletter.buttonLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/** Logos de los sellos y partners del cliente. */
function Partners({ partners }: { partners: FooterData['partners'] }) {
  if (partners.length === 0) return null;

  return (
    <section className="flex flex-col items-center gap-6 border-t border-white/20 pt-8">
      <Eyebrow size="sm" as="h2">
        Nuestros sellos y partners
      </Eyebrow>
      <ul className="flex flex-wrap items-center justify-center gap-8">
        {partners.map((partner) => (
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
  );
}

/** Logo de un partner, con su nombre como alternativa si no hay imagen. */
function PartnerLogo({ partner }: { partner: FooterData['partners'][number] }) {
  const url = mediaUrl(partner.logo);
  return url ? (
    <Image src={url} alt={partner.name} width={120} height={48} />
  ) : (
    <span className="text-primary-foreground/70 text-sm">{partner.name}</span>
  );
}

/** Redes sociales y métodos de pago. Ambos salen de `site-config`. */
function BandaSocial({ config }: { config: SiteConfigData }) {
  const redes = REDES.map((red) => ({ ...red, url: config.social[red.clave] })).filter(
    (red): red is (typeof REDES)[number] & { url: string } => Boolean(red.url),
  );

  if (redes.length === 0 && config.payments.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:justify-between">
      {redes.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Eyebrow size="sm" as="h2">
            Síguenos
          </Eyebrow>
          <ul className="flex flex-wrap gap-3">
            {redes.map((red) => (
              <li key={red.clave}>
                <Link
                  href={red.url}
                  aria-label={red.clave}
                  className="text-primary-foreground/70 hover:text-secondary flex size-10 items-center justify-center rounded-full bg-white/10"
                >
                  <Icon name={red.icono} size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {config.payments.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Eyebrow size="sm" as="h2">
            Pagos aceptados
          </Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {config.payments.map((pago) => (
              <li
                key={pago}
                className="text-primary-foreground/70 rounded-lg bg-white/10 px-3 py-1.5 text-xs"
              >
                {pago}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Enlaces legales y aviso de copyright. */
function BandaLegal({ config, copyright }: { config: SiteConfigData; copyright: string }) {
  return (
    <div className="text-primary-foreground/70 flex flex-col gap-4 border-t border-white/20 pt-8 text-sm sm:flex-row sm:justify-between">
      <ul className="flex flex-wrap gap-4">
        {config.legal.links.map((link) => (
          <li key={`${link.url}-${link.label}`}>
            <Link href={link.url} className="hover:text-secondary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p>{copyright}</p>
    </div>
  );
}

/**
 * Pie del site.
 *
 * El contacto, las redes, los métodos de pago y los enlaces legales **no están
 * en el global `footer`**: se leen de `site-config`, que es su fuente única
 * (specs/payload/modelo-datos.md).
 *
 * La retícula es de 12 columnas porque el diseño reparte anchos distintos: el
 * contacto y la newsletter ocupan tres, las listas de enlaces dos.
 *
 * @example
 * <Footer data={footer} config={siteConfig} />
 */
export function Footer({ data, config }: FooterProps) {
  return (
    <footer className="bg-footer text-primary-foreground mt-auto">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
        {data.virtualAssistant.enabled ? (
          <section className="flex flex-col gap-2 border-b border-white/20 pb-10">
            <Eyebrow size="sm" as="h2">
              {data.virtualAssistant.title ?? 'Asistente virtual'}
            </Eyebrow>
            {data.virtualAssistant.subtitle ? (
              <p className="text-primary-foreground/70 text-sm">{data.virtualAssistant.subtitle}</p>
            ) : null}
          </section>
        ) : null}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <Contacto config={config} />
          {data.columns.map((columna) => (
            <Columna key={columna.title} columna={columna} />
          ))}
        </div>

        <Partners partners={data.partners} />
        <BandaSocial config={config} />
        <BandaLegal config={config} copyright={data.copyright} />
      </div>
    </footer>
  );
}
