import { ctaBlockSchema } from '../../schemas/collections/pages.schema';
import { Button } from '../../primitives/Button';

/**
 * Llamada a la acción: título, subtítulo opcional y uno o varios botones.
 *
 * Los botones se montan con la primitiva `Button`, así que sus variantes y sus
 * colores salen de los tokens del cliente sin tocar este bloque.
 */
export function CtaBlock({ data }: { data: unknown }) {
  const result = ctaBlockSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[CtaBlock] datos inválidos', result.error.issues);
    }
    return null;
  }

  const { title, subtitle, links } = result.data;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
        {title ? <h2>{title}</h2> : null}
        {subtitle ? <p className="text-muted-foreground text-lg">{subtitle}</p> : null}
        {links.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {links.map((link) => (
              <Button key={`${link.url}-${link.label}`} href={link.url} variant={link.variant}>
                {link.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
