import { z } from 'zod';
import { mediaRefSchema } from '../collections/media.schema';

/**
 * Global `footer`: contenido del footer. Redes sociales, pagos y links
 * legales se leen de `site-config` — no se duplican aquí.
 */
export const footerSchema = z.object({
  virtualAssistant: z.object({
    enabled: z.boolean().default(false),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    placeholder: z.string().optional(),
  }),

  columns: z
    .array(
      z.object({
        title: z.string(),
        type: z.enum(['links', 'text', 'schedule', 'newsletter']),
        links: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            }),
          )
          .optional(),
        /** Contenido richText serializado por Payload (Lexical), si `type` es "text". */
        content: z.unknown().optional(),
        newsletter: z
          .object({
            description: z.string().optional(),
            buttonLabel: z.string(),
            provider: z.enum(['mailchimp', 'sendinblue', 'custom']),
            actionUrl: z.string(),
          })
          .optional(),
      }),
    )
    .max(4),

  partners: z.array(
    z.object({
      name: z.string(),
      logo: mediaRefSchema,
      url: z.string().optional(),
    }),
  ),

  copyright: z.string(),
});
