import { z } from 'zod';

/** Global `header`: barra superior y navegación principal. */
export const headerSchema = z.object({
  topBar: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        // Lista corta a propósito: la barra de servicio tiene sitio para cuatro
        // o cinco enlaces, y un `select` con los sesenta iconos del set invita a
        // elegir mal. Ampliarla es legítimo —`mail` se añadió porque el diseño
        // usa un sobre para "Contacto"—, pero hay que tocar **también** las
        // `options` del global de Payload, o el editor no podrá elegir el valor
        // nuevo. El test de paridad comprueba que las dos listas coincidan.
        icon: z.enum(['help', 'phone', 'mail', 'video', 'user', 'custom']),
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
