import { publicContentAccess } from '../access';
import { revalidateDocument } from '../hooks/revalidate';

import type { CollectionConfig } from 'payload';

/**
 * Archivos subidos por el editor: imágenes, vídeos y documentos.
 *
 * Payload genera `filename`, `mimeType`, `filesize`, `width`/`height` y los
 * tamaños derivados por su cuenta — por eso no aparecen como campos. Los
 * cuatro tamaños son los que consume la primitiva `Image` de core-ui
 * (thumbnail/card/hero) más `og`, que solo se usa en metadatos sociales.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: publicContentAccess,
  admin: {
    useAsTitle: 'alt',
    group: 'Contenido',
    description: 'Imágenes, vídeos y documentos del site.',
  },
  /**
   * Árbol de carpetas en el panel, para que el editor sepa dónde va cada
   * archivo y lo encuentre después.
   *
   * Es organización **del panel**, no del disco: Payload lo resuelve con una
   * relación a una colección de carpetas, así que los ficheros siguen todos
   * juntos en `media/`. Organizar también el almacenamiento es otra cosa, y
   * corresponde al `prefix` del adapter de nube cuando se decida DEC-010.
   *
   * ⚠️ Payload marca esta función como **experimental**: "puede cambiar en
   * versiones menores hasta que sea estable" (`Config.folders`, payload 3.88).
   * En la práctica significa que una actualización menor de Payload podría
   * romperla o cambiar cómo se guardan las carpetas. Conviene fijarse en ella
   * al actualizar y no construir encima nada que no se pueda rehacer.
   */
  folders: true,
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1920 },
      // og: recorte fijo 1200x630, la relación que piden Open Graph y Twitter.
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  hooks: {
    afterChange: [revalidateDocument],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Describe la imagen para quien no puede verla. Obligatorio.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      admin: {
        description: 'Pie de foto opcional, visible junto a la imagen.',
      },
    },
  ],
};
