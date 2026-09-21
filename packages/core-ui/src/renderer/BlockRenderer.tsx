import { blockRegistry } from './blockRegistry';
import { normalizePayloadData } from '../payload/normalize-payload-data';

import type { BlockRendererProps } from './types';

/**
 * Recorre la secuencia de bloques de una página y renderiza cada uno con su
 * componente.
 *
 * No valida nada: pasa los datos como `unknown` y cada bloque valida los suyos
 * con su schema Zod. Así el renderer no se acopla a todos los schemas
 * (ver docs/arquitectura/bloques.md).
 *
 * Reparte además los **slots** por `slotId`, para que un hueco se rellene en
 * la instancia que el editor eligió y no en todas las del mismo tipo.
 *
 * Sí los **normaliza**, que no es lo mismo: Payload representa "vacío" con
 * `null` y Zod con `undefined`, así que un bloque con una imagen que tenga
 * `caption: null` no validaría nunca. Se hace aquí una vez, y no en cada
 * bloque, porque es una peculiaridad del transporte que no tiene por qué
 * conocer quien escribe un bloque nuevo — y al primero que se le olvide, su
 * sección sale en blanco sin decir por qué.
 *
 * Un `blockType` sin componente no rompe la página — avisa en desarrollo y no
 * pinta nada. Es la situación normal mientras el catálogo se construye: el
 * editor puede insertar un bloque cuyo componente aún no existe.
 *
 * @example
 * <BlockRenderer blocks={page.blocks} customRegistry={clientRegistry} />
 */
export function BlockRenderer({ blocks, customRegistry, slotRegistry }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        // El registry del cliente manda sobre el de plataforma: así un site
        // sustituye un bloque sin tocar core-ui.
        const Component = customRegistry?.[block.blockType] ?? blockRegistry[block.blockType];

        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            // El guard de NODE_ENV no lo evalúa ESLint: sin la excepción,
            // `no-console` falla en CI (ver docs/estandares/codigo.md).
            // eslint-disable-next-line no-console
            console.warn(`[BlockRenderer] Bloque desconocido: ${block.blockType}`);
          }
          return null;
        }

        // Los slots son código del site, así que no pueden viajar por
        // Payload: lo que viaja es el `slotId` de la instancia, y aquí se
        // canjea por lo que el site haya registrado. Una instancia sin
        // `slotId` —o sin entrada en el registry— simplemente no recibe nada.
        const slotId = typeof block.slotId === 'string' ? block.slotId : undefined;
        const slots = slotId ? (slotRegistry?.[slotId] ?? {}) : {};

        return <Component key={block.id} data={normalizePayloadData(block)} {...slots} />;
      })}
    </>
  );
}
