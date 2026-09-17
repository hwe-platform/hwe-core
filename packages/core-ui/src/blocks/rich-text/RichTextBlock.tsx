import { richTextBlockSchema } from '../../schemas/collections/pages.schema';
import { RichText } from '../../primitives/RichText';

/**
 * Bloque de texto libre. Pinta el contenido que el editor escribió en Payload.
 *
 * Valida sus datos con `safeParse` en lugar de confiar en el renderer: en
 * producción vienen de Payload y ya están tipados, así que la validación es
 * una red de seguridad, no el flujo principal (docs/arquitectura/bloques.md).
 */
export function RichTextBlock({ data }: { data: unknown }) {
  const result = richTextBlockSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[RichTextBlock] datos inválidos', result.error.issues);
    }
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <RichText content={result.data.content} className="max-w-[72ch]" />
    </section>
  );
}
