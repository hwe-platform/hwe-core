import type { Access } from 'payload';

/**
 * Lectura abierta: los sites HWE son públicos, cualquier visitante puede leer
 * el contenido sin autenticarse.
 */
export const publicRead: Access = () => true;

/**
 * Escritura solo para usuarios autenticados. No distingue roles todavía —
 * `super-admin`, `agency` y `client` llegan con el estándar de seguridad
 * (ver specs/payload/modelo-datos.md, notas de implementación).
 */
export const authenticatedOnly: Access = ({ req }) => Boolean(req.user);

/** Combinación habitual de una colección de contenido público y editable. */
export const publicContentAccess = {
  read: publicRead,
  create: authenticatedOnly,
  update: authenticatedOnly,
  delete: authenticatedOnly,
} as const;
