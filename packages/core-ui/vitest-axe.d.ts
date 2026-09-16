// vitest-axe@0.1.0 declara su matcher sobre `namespace Vi` (API de vitest 0.x/1.x).
// Vitest 2.x espera `declare module 'vitest'` en su lugar, así que la ampliación
// de tipos que trae el paquete no se aplica. Se redeclara aquí hasta que
// vitest-axe publique tipos compatibles con vitest 2.
declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
}

export {};
