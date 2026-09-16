import { z } from 'zod';

/** Global `header`: barra superior y navegación principal. */
export const headerSchema = z.object({
  topBar: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        icon: z.enum(['help', 'phone', 'video', 'user', 'custom']),
        url: z.string(),
      }),
    ),
    showLogin: z.boolean().default(false),
    bookingButtonLabel: z.string(),
  }),

  navigation: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
      children: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

/**
 * Forma de escritura de `header`. Los globals no tienen `id`, así que la
 * entrada coincide con el documento; Payload solo manda los campos que
 * cambian, de ahí la variante parcial.
 */
export const headerInputSchema = headerSchema;

/** Forma de escritura en un `update` del global. */
export const headerUpdateSchema = headerSchema.partial();
