import type { CollectionConfig } from 'payload';

/**
 * Colección de usuarios del admin de Payload. Infraestructura de
 * autenticación, no una colección de contenido del modelo de datos
 * (specs/payload/modelo-datos.md) — sin ella no hay login en /admin.
 * Roles y access control llegan cuando se aborde el estándar de
 * seguridad (ver modelo-datos.md, "Notas de implementación").
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
};
