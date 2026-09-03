import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { categoryRefSchema } from './categories.schema';
import { pageBlockSchema } from './pages.schema';
import { personalizationEntrySchema } from '../common.schema';

/**
 * Referencia superficial a un alojamiento, usada por `comparison` para evitar
 * la auto-referencia completa de `accommodationSchema`. Suficiente para
 * mostrar una tarjeta de comparación sin acoplarse al documento entero.
 */
const accommodationLiteRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  mainImage: mediaRefSchema.optional(),
});

/** Documento de la colección `accommodations`: alojamientos del cliente. */
export const accommodationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['emplacement', 'mobilhome', 'cottage', 'chalet', 'tente']),
  subtype: z.string().optional(),
  shortDescription: z.string(),
  /** Contenido richText serializado por Payload (Lexical). No se valida su estructura interna. */
  description: z.unknown(),

  specs: z.object({
    capacity: z.number(),
    bedrooms: z.number(),
    surface: z.number(),
    hasAC: z.boolean(),
    petFriendly: z.boolean(),
  }),

  bedroomDetails: z.array(z.object({ description: z.string() })).optional(),

  equipment: z
    .array(
      z.object({
        label: z.string(),
        icon: z.string(),
        included: z.boolean(),
      }),
    )
    .optional(),

  pricing: z.object({
    from: z.number().optional(),
    currency: z.string().default('EUR'),
    priceNote: z.string().optional(),
  }),

  media: z.object({
    mainImage: mediaRefSchema,
    gallery: z.array(mediaRefSchema).optional(),
    floorPlan: mediaRefSchema.optional(),
    video: z.string().optional(),
  }),

  documents: z
    .array(
      z.object({
        label: z.string(),
        file: mediaRefSchema,
      }),
    )
    .optional(),

  features: z
    .array(
      z.object({
        icon: z.string(),
        label: z.string(),
      }),
    )
    .optional(),

  comparison: z.array(z.union([z.string(), accommodationLiteRefSchema])).optional(),

  category: categoryRefSchema,
  featured: z.boolean().default(false),
  order: z.number().default(0),

  booking: z.object({
    externalId: z.string().optional(),
    bookable: z.boolean().default(false),
  }),

  personalization: z.array(personalizationEntrySchema).optional(),

  blocks: z.array(pageBlockSchema).optional(),
});

/** Referencia a un alojamiento: id sin poblar o documento completo. */
export const accommodationRefSchema = z.union([z.string(), accommodationSchema]);
