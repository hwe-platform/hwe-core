import type { ComponentType } from 'react';

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
 * Mapa de `blockType` a componente. Las claves van en kebab-case, que es como
 * Payload guarda el `blockType` (`media-text`, no `mediaText`).
 */
export type BlockRegistry = Record<string, ComponentType<{ data: unknown }>>;

/** Props de {@link BlockRenderer}. */
export type BlockRendererProps = {
  /** Secuencia de bloques de la página, en el orden que montó el editor. */
  blocks: BlockInstance[];
  /**
   * Registry del site cliente. Tiene prioridad sobre el de plataforma, para
   * que un cliente pueda sustituir un bloque sin tocar core-ui.
   */
  customRegistry?: BlockRegistry;
};
