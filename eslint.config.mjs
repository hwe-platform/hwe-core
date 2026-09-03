import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

// hwe-core es una librería (no una app Next.js), así que no usamos
// eslint-config-next: su parser requiere el paquete `next` instalado,
// una dependencia que este repo no tiene ni necesita. En su lugar,
// componemos directamente los mismos plugins de calidad (TypeScript,
// React, hooks, accesibilidad) que core-web-vitals trae por debajo.
export default defineConfig([
  {
    ignores: ['**/dist/**', '**/.turbo/**', '**/node_modules/**'],
  },
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  prettier,
  {
    settings: {
      // Los sites HWE corren sobre Next.js 15 / React 19 (ver HU-002).
      // Fija la versión para que eslint-plugin-react no intente detectarla
      // desde una dependencia "react" que este paquete aún no instala.
      react: { version: '19.0.0' },
    },
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
