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
