import { z } from 'zod';
import { mediaRefSchema } from '../collections/media.schema';

/** Global `site-config`: configuración general del site, no cambia por página. */
export const siteConfigSchema = z.object({
  general: z.object({
    siteName: z.string(),
    siteDescription: z.string(),
    logo: mediaRefSchema,
    logoInverted: mediaRefSchema,
    stars: z.number().optional(),
    openingDates: z.string(),
  }),

  contact: z.object({
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string(),
    email: z.string(),
  }),

  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    transport: z.array(
      z.object({
        icon: z.enum(['car', 'train', 'plane']),
        label: z.string(),
      }),
    ),
  }),

  languages: z.object({
    available: z.array(z.string()),
    default: z.string(),
    prefixDefault: z.boolean(),
    strategy: z.enum(['prefix', 'domain']),
    domainMap: z
      .array(
        z.object({
          locale: z.string(),
          domain: z.string(),
        }),
      )
      .optional(),
  }),

  social: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
    instagramHandle: z.string().optional(),
  }),

  payments: z.array(z.string()),

  legal: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ),
  }),

  tracking: z.object({
    gtmId: z.string().optional(),
    gaId: z.string().optional(),
    metaPixelId: z.string().optional(),
  }),

  customCode: z.array(
    z.object({
      label: z.string(),
      code: z.string(),
      position: z.enum(['head', 'bodyStart', 'bodyEnd']),
      requiresConsent: z.boolean().default(false),
    }),
  ),

  booking: z.object({
    // TODO: campos específicos según `engine` — pendiente de spec por motor
    engine: z.enum(['thr', 'witbooking', 'mastercamping', 'resalys']),
  }),
});
