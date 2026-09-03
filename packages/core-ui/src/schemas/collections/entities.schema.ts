import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { categoryRefSchema } from './categories.schema';
import { personalizationEntrySchema } from '../common.schema';

/**
 * Documento de la colección `entities`: servicios, actividades, restaurante,
 * entorno y eventos. Los campos específicos de cada `type` son opcionales.
 */
export const entitySchema = z.object({
  id: z.string(),
  type: z.enum(['service', 'activity', 'restaurant', 'environment', 'event', 'custom']),
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  /** Contenido richText serializado por Payload (Lexical). No se valida su estructura interna. */
  description: z.unknown(),
  icon: z.string(),
  image: mediaRefSchema,
  gallery: z.array(mediaRefSchema).optional(),
  tag: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),

  schedule: z
    .object({
      periods: z.array(
        z.object({
          label: z.string(),
          icon: z.enum(['utensils', 'wine', 'clock']),
          hours: z.string(),
        }),
      ),
      note: z.string().optional(),
    })
    .optional(),

  features: z
    .array(
      z.object({
        icon: z.string(),
        label: z.string(),
        detail: z.string(),
      }),
    )
    .optional(),

  ctas: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
        variant: z.enum(['primary', 'outline']),
      }),
    )
    .optional(),

  hasOwnPage: z.boolean().default(false),
  category: categoryRefSchema.optional(),

  personalization: z.array(personalizationEntrySchema).optional(),
});

/** Referencia a una entidad: id sin poblar o documento completo. */
export const entityRefSchema = z.union([z.string(), entitySchema]);
