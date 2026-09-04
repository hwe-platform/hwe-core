import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

// apps/site-demo/ es una app Next.js real dentro del monorepo hwe-core —
// usa la variante "repos-app" (eslint-config-next), a diferencia de
// packages/core-ui/ que usa la variante "repos-librería" (ver
// docs/estandares/herramientas.md).
export default defineConfig([
  {
    // payload-types.ts e importMap.js los genera Payload — no se lintan.
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      'src/payload-types.ts',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      // TypeScript estricto
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Variables sin usar (excepto las que empiezan con _)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Prohibir @ts-ignore — usar @ts-expect-error con comentario
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': 'allow-with-description',
        },
      ],

      // Console: warning en dev, error en CI
      'no-console': process.env.CI ? 'error' : 'warn',

      // Complejidad
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', { max: 3 }],
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', { max: 3 }],
    },
  },
]);
