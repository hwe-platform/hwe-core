import { cn } from '../../lib/cn';
import { esUrlIncrustable } from '../../schemas/collections/pages.schema';
import { PROPORCIONES } from './ratio';

import type { MediaSlotProps } from './media-text.types';

/**
 * Contenido incrustado de un tercero — el mapa de la sección «Accès» del Figma.
 *
 * Va en su propio componente y no dentro de `MediaImage` con un `if` porque un
 * `<iframe>` no es una `<img>`: distinta etiqueta, distintos atributos de
 * accesibilidad y distinto tratamiento de carga. Es la diferencia entre un eje
 * estructural y uno de estilo (`docs/arquitectura/bloques.md`).
 */
export function MediaEmbed({ data, labels }: MediaSlotProps) {
  // Segunda barrera: el schema ya lo rechaza al escribir, pero un dato
  // guardado antes de esa regla —o escrito por la API sin pasar por él— no
  // debe acabar en el `src` de un marco.
  if (!data.embedUrl || !esUrlIncrustable(data.embedUrl)) return null;

  return (
    <div
      className={cn(
        'border-border bg-muted relative overflow-hidden rounded-2xl border shadow-inner',
        PROPORCIONES[data.ratio],
      )}
    >
      <iframe
        src={data.embedUrl}
        title={data.title ?? labels.embed}
        loading="lazy"
        // La URL la escribe el editor en el panel, y sale de un dominio de
        // `DOMINIOS_INCRUSTABLES`. Aun así el marco va aislado: `allow-scripts`
        // hace falta para los mapas; `allow-same-origin` no, y sin él el
        // documento incrustado no alcanza nuestro origen.
        sandbox="allow-scripts allow-popups"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
