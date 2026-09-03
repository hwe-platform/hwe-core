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
