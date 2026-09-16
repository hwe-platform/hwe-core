import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Cobertura mínima por capa (docs/estandares/testing.md). Cada capa suma
      // su propio umbral aquí conforme se implementa — no se aplica un único
      // umbral global al paquete, porque los mínimos son distintos por capa.
      // theme/token-contract.ts queda fuera: es una constante, no tiene lógica.
      include: ['src/schemas/**/*.ts', 'src/primitives/**/*.tsx', 'src/lib/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.types.ts', '**/index.ts'],
      thresholds: {
        // Schemas Zod — fuente de verdad
        'src/schemas/**': { lines: 95, statements: 95, functions: 95, branches: 95 },
        // Primitivas — mismo mínimo que Bloques (criterio de HU-006)
        'src/primitives/**': { lines: 80, statements: 80, functions: 80, branches: 80 },
        // Utilidades compartidas
        'src/lib/**': { lines: 90, statements: 90, functions: 90, branches: 90 },
      },
    },
  },
});
