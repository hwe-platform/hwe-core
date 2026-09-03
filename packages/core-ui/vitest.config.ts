import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Cobertura mínima por capa (docs/estandares/testing.md). Solo schemas/
      // tiene código por ahora — cuando se añadan blocks/, layout/, etc. cada
      // capa suma su propio umbral aquí, no se sube este a todo el paquete.
      include: ['src/schemas/**/*.ts'],
      exclude: ['src/schemas/**/*.test.ts', 'src/schemas/**/*.types.ts', 'src/schemas/**/index.ts'],
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 95,
        branches: 95,
      },
    },
  },
});
