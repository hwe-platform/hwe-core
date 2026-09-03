import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

// apps/site-demo/ es una app Next.js real dentro del monorepo hwe-core —
// usa la variante "repos-app" (eslint-config-next), a diferencia de
// packages/core-ui/ que usa la variante "repos-librería" (ver
// docs/estandares/herramientas.md). eslint-config-next 15.4.x todavía
// exporta configs en formato legado (.eslintrc), así que se traducen a
// flat config con FlatCompat en vez de spread directo.
export default defineConfig([
  {
    ignores: ['**/.next/**', '**/node_modules/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
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
