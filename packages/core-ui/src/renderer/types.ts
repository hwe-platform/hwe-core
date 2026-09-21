import type { ComponentType, ReactNode } from 'react';

/**
 * Un bloque tal y como lo devuelve Payload dentro de `pages.blocks`.
 *
 * `blockType` es la clave con la que se busca el componente en el registry, e
 * `id` el que Payload asigna a cada fila del array. El resto de campos varía
 * según el tipo, así que viajan como `unknown`: el renderer no se acopla a los
 * schemas de todos los bloques — cada bloque valida los suyos (ver
 * docs/arquitectura/bloques.md).
 */
export type BlockInstance = {
  blockType: string;
  id: string;
  [key: string]: unknown;
};

/**
 * Los huecos que un bloque abre para que el site meta contenido propio.
 *
 * La clave es el nombre del slot tal y como lo declara el bloque
 * (`aside`, `sobreLaImagen`), y el valor lo que se pinta en él.
 */
export type BlockSlots = Record<string, ReactNode>;

/**
 * Mapa de `slotId` a los slots de esa instancia.
 *
 * Vive en el repo del cliente —los slots son código suyo, no datos— y se le
 * pasa al renderer. **El renderer no lo importa**: `core-ui` es plataforma y
 * no puede depender de un site concreto.
 *
 * @example
 * export const slotRegistry: SlotRegistry = {
 *   'intro-medallion': { sobreLaImagen: <Insignia etiqueta="Depuis" valor={30} sufijo="Ans" /> },
 * };
 */
export type SlotRegistry = Record<string, BlockSlots>;

/**
 * Lo que recibe un bloque cualquiera.
 *
 * Los slots van sueltos como props, no dentro de un objeto, porque cada bloque
 * declara los suyos por su nombre (`aside`, `sobreLaImagen`). El renderer no
 * sabe cuáles tiene cada uno —ni debe—, así que aquí quedan abiertos y es el
 * bloque quien los tipa al declarar sus propias props.
 */
export type BlockComponentProps = {
  /** Datos del bloque tal y como los devuelve Payload, sin validar. */
  data: unknown;
  [slot: string]: unknown;
};

/**
 * Mapa de `blockType` a componente. Las claves van en kebab-case, que es como
 * Payload guarda el `blockType` (`media-text`, no `mediaText`).
 *
 * Un componente recibe siempre `data`, y además los slots que le toquen según
 * el `slotId` de la instancia.
 */
export type BlockRegistry = Record<string, ComponentType<BlockComponentProps>>;

/** Props de {@link BlockRenderer}. */
export type BlockRendererProps = {
  /** Secuencia de bloques de la página, en el orden que montó el editor. */
  blocks: BlockInstance[];
  /**
   * Registry del site cliente. Tiene prioridad sobre el de plataforma, para
   * que un cliente pueda sustituir un bloque sin tocar core-ui.
   */
  customRegistry?: BlockRegistry;
  /**
   * Slots del site, por `slotId`. El renderer los reparte a la instancia que
   * lleve ese identificador; las demás no reciben nada.
   */
  slotRegistry?: SlotRegistry;
};
