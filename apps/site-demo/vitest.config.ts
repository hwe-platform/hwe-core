import { defineConfig } from 'vitest/config';

/**
 * Vitest en site-demo existe para un solo cometido: el test de paridad entre
 * los configs de Payload y los schemas Zod de core-ui (ver
 * src/collections/README.md). La lógica de los hooks se testea en core-ui,
 * donde vive como funciones puras.
 *
 * Entorno `node`: no se renderiza nada, solo se inspeccionan objetos de config.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
